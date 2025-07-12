const passport = require("passport");
const bcrypt = require("bcryptjs");
const prisma = require("../models/prismaClient");

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, location, profilePhoto, isPublic } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required." });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        location,
        profilePhoto,
        isPublic: isPublic !== undefined ? isPublic : true,
      },
    });
    const { password: pw, ...userWithoutPassword } = user;
    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
    req.logIn(user, (err) => {
      if (err) return next(err);
      const { password, ...userWithoutPassword } = user;
      res.json({ message: "Logged in successfully", user: userWithoutPassword });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
};

exports.checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ authenticated: true, user: userWithoutPassword });
  } else {
    res.json({ authenticated: false });
  }
};

exports.googleRegister = async (req, res, next) => {
  try {
    const { credential } = req.body; // credential is the Google ID token from frontend

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name;
    const profilePhoto = payload.picture;

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          profilePhoto,
          isPublic: true,
          password: "", // No password for Google users
        },
      });
    }
    // Remove password before sending user object
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({ message: "Google registration successful", user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

exports.googleCallback = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Missing Google OAuth code" });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    const email = data.email;
    const name = data.name;
    const profilePhoto = data.picture;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          profilePhoto,
          isPublic: true,
          password: "",
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          googleTokenExpiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          googleTokenExpiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        },
      });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ message: "Google authentication successful", user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      location,
      profilePhoto,
      isPublic,
      bio,
      skillsOffered,
      skillsWanted,
      skillsInterested
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all profile data in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          location,
          profilePhoto,
          isPublic: isPublic !== undefined ? isPublic : true,
          bio,
        },
      });

      // Handle skills offered
      if (skillsOffered && skillsOffered.length > 0) {
        for (const skillName of skillsOffered) {
          let skill = await tx.skill.findUnique({ where: { name: skillName } });
          if (!skill) {
            skill = await tx.skill.create({ data: { name: skillName } });
          }
          await tx.user.update({
            where: { id: newUser.id },
            data: {
              skillsOffered: {
                connect: { id: skill.id },
              },
            },
          });
        }
      }

      // Handle skills wanted
      if (skillsWanted && skillsWanted.length > 0) {
        for (const skillName of skillsWanted) {
          let skill = await tx.skill.findUnique({ where: { name: skillName } });
          if (!skill) {
            skill = await tx.skill.create({ data: { name: skillName } });
          }
          await tx.user.update({
            where: { id: newUser.id },
            data: {
              skillsWanted: {
                connect: { id: skill.id },
              },
            },
          });
        }
      }

      // Handle skills interested (same as skills wanted for now)
      if (skillsInterested && skillsInterested.length > 0) {
        for (const skillName of skillsInterested) {
          let skill = await tx.skill.findUnique({ where: { name: skillName } });
          if (!skill) {
            skill = await tx.skill.create({ data: { name: skillName } });
          }
          await tx.user.update({
            where: { id: newUser.id },
            data: {
              skillsWanted: {
                connect: { id: skill.id },
              },
            },
          });
        }
      }

      return newUser;
    });

    // Get the created user with all relations
    const userWithRelations = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        skillsOffered: true,
        skillsWanted: true,
      },
    });

    const { password: pw, ...userWithoutPassword } = userWithRelations;
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};