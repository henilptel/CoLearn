const prisma = require("../models/prismaClient");

exports.createRating = async (req, res) => {
  try {
    const { receiverId, rating, feedback } = req.body;
    const giverId = req.user.id;
    const newRating = await prisma.rating.create({
      data: {
        giverId,
        receiverId,
        rating,
        feedback,
      },
    });
    res.status(201).json({ message: "Rating created", rating: newRating });
  } catch (err) {
    res.status(500).json({ message: "Failed to create rating", error: err.message });
  }
};

exports.getRatingsGiven = async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { giverId: req.user.id },
      include: { receiver: true },
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ratings", error: err.message });
  }
};

exports.getRatingsReceived = async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { receiverId: req.user.id },
      include: { giver: true },
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ratings", error: err.message });
  }
};

exports.getRatingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await prisma.rating.findMany({
      where: { receiverId: userId },
      include: { giver: true },
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ratings", error: err.message });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    const updatedRating = await prisma.rating.update({
      where: { id },
      data: { rating, feedback },
    });
    res.json({ message: "Rating updated", rating: updatedRating });
  } catch (err) {
    res.status(500).json({ message: "Failed to update rating", error: err.message });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.rating.delete({ where: { id } });
    res.json({ message: "Rating deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete rating", error: err.message });
  }
};