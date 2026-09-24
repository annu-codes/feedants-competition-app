import express from "express";
import User from "../models/User.model.js";

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("User creation error:", error);

    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({createdAt: -1});

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

export default router;