const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    goal: { type: String, default: "maintain" },
    days: [
      {
        day: { type: String, required: true },
        meals: [
          {
            mealType: { type: String, required: true },
            description: { type: String, required: true },
            calories: { type: Number, default: 0 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);
