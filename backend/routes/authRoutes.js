const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router.post("/login", authController.login);

router.post("/register", authController.register);

router.post("/register-user", authController.registerUser);

router.post("/logout", authController.logout);

router.get("/status", authController.checkAuth);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar"
    ],
    accessType: "offline",
    prompt: "consent"
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    // Redirect to frontend or send session info
    res.redirect("http://localhost:5173"); // Adjust as needed
  }
);

module.exports = router;