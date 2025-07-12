const prisma = require("../models/prismaClient");

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        skillsOffered: true,
        skillsWanted: true,
        timeSlots: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { skillsOffered, skillsWanted, location, bio, isPublic, profilePhoto, ...otherData } = req.body;
    const userId = req.user.id;

    // Start a transaction for complex updates
    const result = await prisma.$transaction(async (tx) => {
      // Update basic user info
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          ...otherData,
          location,
          bio,
          isPublic,
          profilePhoto,
        },
      });

      // Handle skills offered
      if (skillsOffered && Array.isArray(skillsOffered)) {
        // First, remove existing connections
        await tx.user.update({
          where: { id: userId },
          data: {
            skillsOffered: {
              set: [], // Clear existing connections
            },
          },
        });

        // Create or connect skills
        for (const skillName of skillsOffered) {
          let skill = await tx.skill.findFirst({
            where: { name: skillName },
          });

          if (!skill) {
            skill = await tx.skill.create({
              data: {
                name: skillName,
                description: `Skill: ${skillName}`,
                category: 'OTHER', // Default category
              },
            });
          }

          await tx.user.update({
            where: { id: userId },
            data: {
              skillsOffered: {
                connect: { id: skill.id },
              },
            },
          });
        }
      }

      // Handle skills wanted
      if (skillsWanted && Array.isArray(skillsWanted)) {
        // First, remove existing connections
        await tx.user.update({
          where: { id: userId },
          data: {
            skillsWanted: {
              set: [], // Clear existing connections
            },
          },
        });

        // Create or connect skills
        for (const skillName of skillsWanted) {
          let skill = await tx.skill.findFirst({
            where: { name: skillName },
          });

          if (!skill) {
            skill = await tx.skill.create({
              data: {
                name: skillName,
                description: `Skill: ${skillName}`,
                category: 'OTHER', // Default category
              },
            });
          }

          await tx.user.update({
            where: { id: userId },
            data: {
              skillsWanted: {
                connect: { id: skill.id },
              },
            },
          });
        }
      }

      return updatedUser;
    });

    // Fetch updated user with relations
    const userWithRelations = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skillsOffered: true,
        skillsWanted: true,
        timeSlots: true,
      },
    });

    const { password, ...userWithoutPassword } = userWithRelations;
    res.json({ message: "Profile updated successfully", user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        skillsOffered: true,
        skillsWanted: true,
        timeSlots: true,
        ratingsReceived: {
          include: {
            giver: {
              select: {
                id: true,
                name: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if profile is public or if it's the current user
    if (!user.isPublic && (!req.user || req.user.id !== user.id)) {
      return res.status(403).json({ message: "Profile is private" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

// Get all available tags/skills
exports.getAllTags = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: "asc" },
    });
    
    const tags = skills.map(skill => skill.name);
    res.json({ success: true, tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
