import express from "express";
import Competition from "../models/Competition.model.js";

const router = express.Router();

// Get all competitions
router.get("/", async (req, res) => {
  try {
    const competitions = await Competition.find();

    res.json(competitions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch competitions",
    });
  }
});

// Create a new competition
router.post("/", async (req, res) => {
  try {
    const competition = await Competition.create(req.body);

    res.status(201).json(competition);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create competition",
      error: error.message,
    });
  }
});

// Update competition
router.patch("/:id", async (req, res) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    res.json(competition);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update competition",
      error: error.message,
    });
  }
});

export default router;