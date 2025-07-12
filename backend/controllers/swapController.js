const prisma = require("../models/prismaClient");

exports.createSwapRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const requesterId = req.user.id;
    const swapRequest = await prisma.swapRequest.create({
      data: {
        requesterId,
        receiverId,
        message,
        status:"PENDING",
      },
    });
    res.status(201).json({ message: "Swap request created", swapRequest });
  } catch (err) {
    res.status(500).json({ message: "Failed to create swap request", error: err.message });
  }
};

exports.getMySwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.swapRequest.findMany({
      where: { requesterId: userId },
      include: { receiver: true },
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
      include: { requester: true },
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