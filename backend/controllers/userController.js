const prisma = require("../models/prismaClient");

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        skillsOffered: true,
        skillsWanted: true,
        timeSlots: true,
        ratingsGiven: true,
        ratingsReceived: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const { name, location, bio, profilePhoto, isPublic } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, location, bio, profilePhoto, isPublic },
    });
    const { password, ...userWithoutPassword } = user;
    res.json({ message: "Profile updated", user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        skillsOffered: true,
        skillsWanted: true,
        timeSlots: true,
        ratingsGiven: true,
        ratingsReceived: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        skillsOffered: true,
        skillsWanted: true,
      },
    });
    res.json(users.map(({ password, ...user }) => user));
  } catch (err) {
    res.status(500).json({ message: "Failed to search users", error: err.message });
  }
};

exports.updateUserSkills = async (req, res) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        skillsOffered: {
          set: skillsOffered ? skillsOffered.map(id => ({ id })) : [],
        },
        skillsWanted: {
          set: skillsWanted ? skillsWanted.map(id => ({ id })) : [],
        },
      },
      include: {
        skillsOffered: true,
        skillsWanted: true,
      },
    });
    res.json({
      message: "Skills updated successfully",
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update skills", error: err.message });
  }
};
