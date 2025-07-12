const passport = require("passport");
const bcrypt = require("bcryptjs");
const prisma = require("../models/prismaClient");

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, location, profilePhoto, isPublic } = req.body;
    if (!email || !password || !name || !isPublic) {
      return res.status(400).json({ message: "Email, password, name and Profile View status are required." });
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
        isPublic,
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