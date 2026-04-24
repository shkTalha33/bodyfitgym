const bcrypt = require("bcryptjs");
const connectDB = require("../db");
const User = require("../models/User");
const Meal = require("../models/Meal");
const Workout = require("../models/Workout");
const ProgressLog = require("../models/ProgressLog");

const run = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({ email: "demo@gymdash.app" }),
    Meal.deleteMany({}),
    Workout.deleteMany({}),
    ProgressLog.deleteMany({}),
  ]);

  const user = await User.create({
    name: "Demo User",
    email: "demo@gymdash.app",
    passwordHash: await bcrypt.hash("Password123!", 10),
    stats: { age: 28, heightCm: 178, weightKg: 78, goal: "fat_loss" },
    preferences: {
      dietType: "high_protein",
      fitnessLevel: "intermediate",
      schedule: ["Mon", "Wed", "Fri"],
    },
  });

  await Meal.insertMany([
    {
      userId: user._id,
      name: "Oats and protein",
      eatenAt: new Date(),
      protein: 35,
      carbs: 45,
      fats: 12,
      calories: 430,
    },
  ]);

  await Workout.create({
    userId: user._id,
    name: "Push day",
    date: new Date(),
    durationMin: 62,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8 },
      { name: "Overhead Press", sets: 3, reps: 10 },
    ],
  });

  await ProgressLog.create({
    userId: user._id,
    date: new Date(),
    weightKg: 78,
    sleepHours: 7.5,
    waterMl: 2200,
    steps: 8900,
  });

  console.log("Seed completed with demo@gymdash.app / Password123!");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
