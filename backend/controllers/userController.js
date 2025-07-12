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
    const { 
      skillsOffered, 
      skillsWanted, 
      location, 
      bio, 
      isPublic, 
      profilePhoto, 
      skillsInterested, 
      timeSlots,
      currentPost,
      experienceYears,
      experienceMonths,
      name,
      ...otherData 
    } = req.body;
    const userId = req.user.id;

    // Start a transaction for complex updates
    const result = await prisma.$transaction(async (tx) => {
      // Update basic user info with only valid fields
      const updateData = {
        location,
        bio,
        isPublic,
        profilePhoto,
      };

      // Add name if provided
      if (name) {
        updateData.name = name;
      }

      // Handle experience years (convert from frontend format)
      if (experienceYears !== undefined) {
        updateData.experience_years = parseInt(experienceYears) || 0;
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: updateData,
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

      // Handle time slots
      if (timeSlots && Array.isArray(timeSlots)) {
        // First, delete existing time slots for this user
        await tx.timeSlot.deleteMany({
          where: { userId: userId },
        });

        // Create new time slots
        for (const slot of timeSlots) {
          await tx.timeSlot.create({
            data: {
              userId: userId,
              day: slot.day,
              from: slot.from,
              to: slot.to,
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

// Get all users for browsing (only public profiles)
exports.getAllUsers = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const users = await prisma.user.findMany({
      where: { 
        isPublic: true,
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        location: true,
        bio: true,
        profilePhoto: true,
        skillsOffered: {
          select: {
            name: true
          }
        },
        skillsWanted: {
          select: {
            name: true
          }
        },
        ratingsReceived: {
          select: {
            rating: true
          }
        },
        createdAt: true
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average ratings and format skills
    const formattedUsers = users.map(user => {
      const ratings = user.ratingsReceived.map(r => r.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;

      return {
        id: user.id,
        name: user.name,
        location: user.location,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
        skillsOffered: user.skillsOffered.map(s => s.name),
        skillsWanted: user.skillsWanted.map(s => s.name),
        rating: Math.round(averageRating * 10) / 10,
        noOfReviews: ratings.length,
        noOfSessions: 0, // TODO: Calculate from actual sessions
        isPublicProfile: true
      };
    });

    res.json({ 
      success: true, 
      users: formattedUsers,
      total: formattedUsers.length 
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Search users by skills, name, or location
exports.searchUsers = async (req, res) => {
  try {
    const { q, skill, location, limit = 20, offset = 0 } = req.query;
    
    let whereClause = {
      isPublic: true,
      isActive: true
    };

    if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (skill) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        {
          skillsOffered: {
            some: {
              name: { contains: skill, mode: 'insensitive' }
            }
          }
        },
        {
          skillsWanted: {
            some: {
              name: { contains: skill, mode: 'insensitive' }
            }
          }
        }
      ];
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        location: true,
        bio: true,
        profilePhoto: true,
        skillsOffered: {
          select: {
            name: true
          }
        },
        skillsWanted: {
          select: {
            name: true
          }
        },
        ratingsReceived: {
          select: {
            rating: true
          }
        }
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' }
    });

    // Format users same as getAllUsers
    const formattedUsers = users.map(user => {
      const ratings = user.ratingsReceived.map(r => r.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;

      return {
        id: user.id,
        name: user.name,
        location: user.location,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
        skillsOffered: user.skillsOffered.map(s => s.name),
        skillsWanted: user.skillsWanted.map(s => s.name),
        rating: Math.round(averageRating * 10) / 10,
        noOfReviews: ratings.length,
        noOfSessions: 0,
        isPublicProfile: true
      };
    });

    res.json({ 
      success: true, 
      users: formattedUsers,
      total: formattedUsers.length,
      query: { q, skill, location }
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
