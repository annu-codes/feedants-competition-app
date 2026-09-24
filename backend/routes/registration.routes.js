import express from "express";
import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Competition from "../models/Competition.model.js";

const router = express.Router();

router.post("/:competitionId/register", async (req, res) => {
  const { competitionId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "userId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    return res.status(400).json({
      message: "Invalid competition ID",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  try {
    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    const now = new Date();

    if (now < competition.startDate) {
      return res.status(400).json({
        message: "Registration is not open yet",
      });
    }

    if (now > competition.endDate) {
      return res.status(400).json({
        message: "Competition has ended",
      });
    }

    if (competition.registeredCount >= competition.totalSpots) {
      return res.status(400).json({
        message: "Competition is full",
      });
    }

    const existingRegistration = await Registration.findOne({
      userId,
      competitionId,
      status: "registered",
    });

    if (existingRegistration) {
      return res.status(409).json({
        message: "User is already registered",
      });
    }

    const registration = await Registration.create({
      userId,
      competitionId,
      status: "registered",
    });

    await Competition.findByIdAndUpdate(
      competitionId,
      {
        $inc: {
          registeredCount: 1,
        },
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      message: "Registration successful",
      registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User is already registered",
      });
    }

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

export default router;