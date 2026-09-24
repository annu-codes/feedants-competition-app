import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },

    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index(
  { userId: 1, competitionId: 1 },
  { unique: true }
);

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

export default Registration;