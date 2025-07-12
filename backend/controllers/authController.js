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
    // This is a placeholder for Google registration
    // You would need to implement Google OAuth verification here
    res.status(501).json({ message: "Google registration not implemented yet" });
  } catch (err) {
    next(err);
  }
};

exports.googleCallback = async (req, res, next) => {
  try {
    // This is a placeholder for Google callback
    // You would need to implement Google OAuth verification here
    res.status(501).json({ message: "Google callback not implemented yet" });
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