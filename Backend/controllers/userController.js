const User = require("../models/User");
const {
  clamp,
  pickEnum,
  isProfileComplete,
  ALLOWED_GOALS,
  ALLOWED_FITNESS,
  ALLOWED_ACTIVITY,
  ALLOWED_DIET,
  ALLOWED_EQUIPMENT,
  ALLOWED_SESSION_MIN,
  ALLOWED_MEALS_PER_DAY,
  ALLOWED_MUSCLE,
  ALLOWED_PLAN_STYLES,
} = require("../utils/userProfile");

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash -refreshTokens").lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({
    ...user,
    id: user._id,
    profileComplete: isProfileComplete(user),
  });
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, stats: bodyStats, preferences: bodyPrefs } = req.body || {};

  if (typeof name === "string" && name.trim().length >= 2) {
    user.name = name.trim();
  }

  if (bodyStats && typeof bodyStats === "object") {
    if (bodyStats.heightCm != null) user.stats.heightCm = clamp(bodyStats.heightCm, 120, 230);
    if (bodyStats.weightKg != null) user.stats.weightKg = clamp(bodyStats.weightKg, 35, 200);
    if (bodyStats.age != null) user.stats.age = clamp(bodyStats.age, 14, 90);
    if (bodyStats.goal != null) {
      const g = pickEnum(bodyStats.goal, ALLOWED_GOALS, "");
      if (g) user.stats.goal = g;
    }
  }

  if (bodyPrefs && typeof bodyPrefs === "object") {
    if (bodyPrefs.dietType != null) {
      const v = pickEnum(bodyPrefs.dietType, ALLOWED_DIET, "");
      if (v) user.preferences.dietType = v;
    }
    if (bodyPrefs.fitnessLevel != null) {
      const v = pickEnum(bodyPrefs.fitnessLevel, ALLOWED_FITNESS, "");
      if (v) user.preferences.fitnessLevel = v;
    }
    if (bodyPrefs.activityLevel != null) {
      const v = pickEnum(bodyPrefs.activityLevel, ALLOWED_ACTIVITY, "");
      if (v) user.preferences.activityLevel = v;
    }
    if (bodyPrefs.mealsPerDay != null) {
      const v = pickEnum(String(bodyPrefs.mealsPerDay), ALLOWED_MEALS_PER_DAY, "");
      if (v) user.preferences.mealsPerDay = v;
    }
    if (bodyPrefs.equipment != null) {
      const v = pickEnum(bodyPrefs.equipment, ALLOWED_EQUIPMENT, "");
      if (v) user.preferences.equipment = v;
    }
    if (bodyPrefs.sessionMinutes != null) {
      const v = pickEnum(String(bodyPrefs.sessionMinutes), ALLOWED_SESSION_MIN, "");
      if (v) user.preferences.sessionMinutes = v;
    }
    if (bodyPrefs.planStyle != null) {
      const v = pickEnum(bodyPrefs.planStyle, ALLOWED_PLAN_STYLES, "");
      if (v) user.preferences.planStyle = v;
    }
    if (bodyPrefs.targetCalories != null) {
      user.preferences.targetCalories = clamp(bodyPrefs.targetCalories, 1200, 5000);
    }
    if (Array.isArray(bodyPrefs.workoutFocus)) {
      const clean = [...new Set(bodyPrefs.workoutFocus.map((x) => String(x).toLowerCase()))].filter((x) =>
        ALLOWED_MUSCLE.includes(x)
      );
      user.preferences.workoutFocus = clean;
    }
  }

  const doc = user.toObject();
  user.preferences.profileComplete = isProfileComplete(doc);

  await user.save();

  const out = await User.findById(user._id).select("-passwordHash -refreshTokens").lean();
  return res.json({
    ...out,
    id: out._id,
    profileComplete: isProfileComplete(out),
  });
};

module.exports = { getProfile, updateProfile };
