const mongoose = require("mongoose");

const progressLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true },
    weightKg: { type: Number, default: 0 },
    measurements: {
      chestCm: { type: Number, default: 0 },
      waistCm: { type: Number, default: 0 },
      hipsCm: { type: Number, default: 0 },
    },
    sleepHours: { type: Number, default: 0 },
    waterMl: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgressLog", progressLogSchema);
