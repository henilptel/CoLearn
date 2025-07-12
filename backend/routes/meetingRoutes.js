// backend/routes/meetingRoutes.js
const express = require("express");
const {
  getToken,
  createRoom,
  startRecording,
  stopRecording,
} = require("../controllers/MeetingController.js"); // Keep the capital M since that's your actual filename

const router = express.Router();

router.post("/token", getToken);
router.post("/room", createRoom);
router.post("/recordings/start", startRecording);
router.post("/recordings/stop", stopRecording);

module.exports = router;