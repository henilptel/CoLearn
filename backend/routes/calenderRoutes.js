const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/event", ensureAuthenticated, calendarController.createCalendarEvent);
router.get("/events", ensureAuthenticated, calendarController.listCalendarEvents);
router.delete("/event/:eventId", ensureAuthenticated, calendarController.deleteCalendarEvent);

module.exports = router;
router.get("/free-slots/:otherUserId", ensureAuthenticated, calenderController.getFreeTimeSlots);