const { google } = require("googleapis");
const prisma = require("../models/prismaClient");

exports.createCalendarEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeSlotId, summary, description } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ message: "Google account not linked." });
    }

    const timeSlot = await prisma.timeSlot.findUnique({ where: { id: timeSlotId } });
    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found." });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: summary || "Skill Swap Session",
      description: description || "",
      start: {
        dateTime: `${getDateTimeForSlot(timeSlot.day, timeSlot.from)}`,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: `${getDateTimeForSlot(timeSlot.day, timeSlot.to)}`,
        timeZone: "Asia/Kolkata",
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    res.json({ message: "Event created", eventId: response.data.id, htmlLink: response.data.htmlLink });
  } catch (err) {
    res.status(500).json({ message: "Failed to create calendar event", error: err.message });
  }
};

// Helper function to convert day and time to ISO string (implement as needed)
function getDateTimeForSlot(day, time) {
  // Example: returns "2024-06-15T09:00:00"
  // You need to map day to actual date and combine with time
  // For demo, just return a fixed date
  return `2024-06-15T${time}:00`;
}

exports.listCalendarEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ message: "Google account not linked." });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date().toISOString(),
    });

    res.json({ events: response.data.items });
  } catch (err) {
    res.status(500).json({ message: "Failed to list calendar events", error: err.message });
  }
};

exports.deleteCalendarEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ message: "Google account not linked." });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete calendar event", error: err.message });
  }
};

exports.getFreeTimeSlots = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user
    const { otherUserId } = req.params; // The user whose timeslots you want to check

    // Get authenticated user's Google Calendar events
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ message: "Google account not linked." });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Get all events for the next 30 days
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    const eventsRes = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: thirtyDaysLater.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = eventsRes.data.items.map(event => ({
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
    }));

    // Get timeslots of the other user
    const otherUserSlots = await prisma.timeSlot.findMany({
      where: { userId: otherUserId },
    });

    // Helper to convert slot to Date objects (adjust as needed for your schema)
    function slotToDate(slot) {
      // For demo: assumes slot.from and slot.to are "HH:mm" and slot.day is a string like "MONDAY"
      // You should map slot.day to an actual date in the next 30 days
      // Here, we just use the next occurrence of that day
      const daysOfWeek = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
      const today = new Date();
      const slotDayIdx = daysOfWeek.indexOf(slot.day);
      const todayIdx = today.getDay();
      let daysUntilSlot = (slotDayIdx - todayIdx + 7) % 7;
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + daysUntilSlot);

      // Set start time
      const [fromHour, fromMin] = slot.from.split(":").map(Number);
      const slotStart = new Date(slotDate);
      slotStart.setHours(fromHour, fromMin, 0, 0);

      // Set end time
      const [toHour, toMin] = slot.to.split(":").map(Number);
      const slotEnd = new Date(slotDate);
      slotEnd.setHours(toHour, toMin, 0, 0);

      return { start: slotStart, end: slotEnd, ...slot };
    }

    // Filter timeslots that do not overlap with any event
    function isOverlapping(slotStart, slotEnd, eventStart, eventEnd) {
      return (slotStart < eventEnd) && (slotEnd > eventStart);
    }

    const freeSlots = otherUserSlots.filter(slot => {
      const { start, end } = slotToDate(slot);
      return !events.some(event =>
        isOverlapping(start, end, event.start, event.end)
      );
    });

    res.json({ freeSlots });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch free time slots", error: err.message });
  }
};