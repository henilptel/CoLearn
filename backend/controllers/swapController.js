const prisma = require("../models/prismaClient");

exports.createSwapRequest = async (req, res) => {
  try {
    const { receiverId, message, offeredSkill, requestedSkill, timeSlotId } = req.body;
    const requesterId = req.user.id;

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // If timeSlotId is provided, validate it
    if (timeSlotId) {
      const timeSlot = await prisma.timeSlot.findUnique({
        where: { id: timeSlotId },
      });
      if (!timeSlot || timeSlot.userId !== receiverId) {
        return res.status(400).json({ message: "Invalid or unavailable timeslot selected" });
      }

      const existingSwap = await prisma.swapRequest.findFirst({
        where: {
          receiverId,
          timeSlotId,
          status: { in: ["PENDING", "ACCEPTED"] },
        },
      });
      if (existingSwap) {
        return res.status(409).json({ message: "Timeslot already booked" });
      }
    }

    const swapRequest = await prisma.swapRequest.create({
      data: {
        requesterId,
        receiverId,
        message: message || "",
        offeredSkill: offeredSkill || "",
        requestedSkill: requestedSkill || "",
        timeSlotId: timeSlotId || null,
        status: "PENDING",
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    res.status(201).json({ message: "Swap request created", swapRequest });
  } catch (err) {
    console.error("Error creating swap request:", err);
    res.status(500).json({ message: "Failed to create swap request", error: err.message });
  }
};

exports.getMySwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.swapRequest.findMany({
      where: { requesterId: userId },
      include: { 
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch swap requests", error: err.message });
  }
};

exports.getReceivedSwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.swapRequest.findMany({
      where: { receiverId: userId },
      include: { 
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch received swap requests", error: err.message });
  }
};

exports.updateSwapRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status: PENDING, ACCEPTED, REJECTED, CANCELLED, COMPLETED
    const swapRequest = await prisma.swapRequest.update({
      where: { id },
      data: { status },
    });
    res.json({ message: "Swap request updated", swapRequest });
  } catch (err) {
    res.status(500).json({ message: "Failed to update swap request", error: err.message });
  }
};

exports.deleteSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.swapRequest.delete({ where: { id } });
    res.json({ message: "Swap request deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete swap request", error: err.message });
  }
};

exports.getSwapRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id },
      include: { requester: true, receiver: true },
    });
    if (!swapRequest) return res.status(404).json({ message: "Swap request not found" });
    res.json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch swap request", error: err.message });
  }
};