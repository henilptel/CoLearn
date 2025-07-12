const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);

router.post("/register", authController.register);

router.post("/logout", authController.logout);

router.get("/status", authController.checkAuth);

router.post("/google/register", authController.googleRegister);

router.post("/google/callback", authController.googleCallback);

module.exports = router;