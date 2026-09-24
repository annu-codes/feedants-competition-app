import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    totalSpots: {
      type: Number,
      required: true,
      min: 1,
    },

    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["upcoming", "open", "full", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

const Competition = mongoose.model("Competition", competitionSchema);

export default Competition;