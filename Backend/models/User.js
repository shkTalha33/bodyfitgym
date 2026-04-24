const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    stats: {
      heightCm: { type: Number, default: 0 },
      weightKg: { type: Number, default: 0 },
      age: { type: Number, default: 0 },
      goal: { type: String, default: "maintain" },
    },
    preferences: {
      dietType: { type: String, default: "balanced" },
      fitnessLevel: { type: String, default: "beginner" },
      schedule: { type: [String], default: [] },
    },
    refreshTokens: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
