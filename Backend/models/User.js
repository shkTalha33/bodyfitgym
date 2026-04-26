const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    walletId: { type: String, default: null },
    walletAddress: { type: String, default: null },
    stats: {
      heightCm: { type: Number, default: 0 },
      weightKg: { type: Number, default: 0 },
      age: { type: Number, default: 0 },
      goal: { type: String, default: "" },
    },
    preferences: {
      dietType: { type: String, default: "" },
      fitnessLevel: { type: String, default: "" },
      activityLevel: { type: String, default: "" },
      mealsPerDay: { type: String, default: "" },
      planStyle: { type: String, default: "" },
      targetCalories: { type: Number, default: 0 },
      equipment: { type: String, default: "" },
      sessionMinutes: { type: String, default: "" },
      workoutFocus: { type: [String], default: [] },
      profileComplete: { type: Boolean, default: false },
      schedule: { type: [String], default: [] },
    },
    refreshTokens: { type: [String], default: [] },
    savedPlans: {
      dietPlan: { type: mongoose.Schema.Types.Mixed, default: null },
      dietPlanSavedAt: { type: Date, default: null },
      weeklyMeals: { type: mongoose.Schema.Types.Mixed, default: null },
      weeklyMealsSavedAt: { type: Date, default: null },
      workoutPlan: { type: mongoose.Schema.Types.Mixed, default: null },
      workoutPlanSavedAt: { type: Date, default: null },
      workoutDailyLog: {
        type: [
          {
            date: { type: String, required: true },
            percent: { type: Number, default: 0 },
            completedBlocks: { type: Number, default: 0 },
            totalBlocks: { type: Number, default: 0 },
          },
        ],
        default: [],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
