const prisma = require("../models/prismaClient");

// Create time slots for a user
const createTimeSlots = async (req, res) => {
  try {
    const { availability } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;

    // Delete existing time slots for this user
    await prisma.timeSlot.deleteMany({
      where: { userId },
    });

    // Create new time slots
    const timeSlots = [];
    
    for (const dayAvailability of availability) {
      if (dayAvailability.enabled && dayAvailability.slots.length > 0) {
        for (const slot of dayAvailability.slots) {
          const timeSlot = await prisma.timeSlot.create({
            data: {
              userId,
              day: dayAvailability.day,
              from: slot.start,
              to: slot.end,
            },
          });
          timeSlots.push(timeSlot);
        }
      }
    }

    res.json({ 
      success: true, 
      message: "Time slots created successfully", 
      timeSlots 
    });
  } catch (error) {
    console.error("Error creating time slots:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get time slots for a user
const getTimeSlots = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const timeSlots = await prisma.timeSlot.findMany({
      where: { userId },
      orderBy: [
        { day: "asc" },
        { from: "asc" },
      ],
    });

    res.json({ success: true, timeSlots });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update time slots for a user
const updateTimeSlots = async (req, res) => {
  try {
    const { userId } = req.params;
    const { availability } = req.body;
    
    // Check if user is updating their own time slots
    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete existing time slots
    await prisma.timeSlot.deleteMany({
      where: { userId },
    });

    // Create new time slots
    const timeSlots = [];
    
    for (const dayAvailability of availability) {
      if (dayAvailability.enabled && dayAvailability.slots.length > 0) {
        for (const slot of dayAvailability.slots) {
          const timeSlot = await prisma.timeSlot.create({
            data: {
              userId,
              day: dayAvailability.day,
              from: slot.start,
              to: slot.end,
            },
          });
          timeSlots.push(timeSlot);
        }
      }
    }

    res.json({ 
      success: true, 
      message: "Time slots updated successfully", 
      timeSlots 
    });
  } catch (error) {
    console.error("Error updating time slots:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createTimeSlots,
  getTimeSlots,
  updateTimeSlots,
};
