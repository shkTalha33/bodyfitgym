const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    durationMin: { type: Number, default: 0 },
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number, default: 0 },
        reps: { type: Number, default: 0 },
        timeSec: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
