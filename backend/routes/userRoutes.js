const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

// Tags routes
router.get("/tags", userController.getAllTags);

// User profile routes
router.get("/profile", requireAuth, userController.getUserProfile);
router.put("/profile", requireAuth, userController.updateUserProfile);
router.get("/:id", userController.getUserById);

module.exports = router;
