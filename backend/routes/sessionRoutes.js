const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

// Time slots routes
router.post("/time-slots", requireAuth, sessionController.createTimeSlots);
router.get("/:userId/time-slots", sessionController.getTimeSlots);
router.put("/:userId/time-slots", requireAuth, sessionController.updateTimeSlots);

module.exports = router;
