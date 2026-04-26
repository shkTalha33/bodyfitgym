const User = require("../models/User");

async function saveDietPlanToUser(userId, data) {
  await User.findByIdAndUpdate(userId, {
    $set: {
      "savedPlans.dietPlan": data,
      "savedPlans.dietPlanSavedAt": new Date(),
    },
  });
}

async function saveWeeklyMealsToUser(userId, data) {
  await User.findByIdAndUpdate(userId, {
    $set: {
      "savedPlans.weeklyMeals": data,
      "savedPlans.weeklyMealsSavedAt": new Date(),
    },
  });
}

async function saveWorkoutPlanToUser(userId, data) {
  const totalBlocks = Array.isArray(data?.sections) ? data.sections.length : 0;
  const date = new Date().toISOString().slice(0, 10);
  const user = await User.findById(userId);
  if (!user) return;
  user.savedPlans = user.savedPlans || {};
  user.savedPlans.workoutPlan = data;
  user.savedPlans.workoutPlanSavedAt = new Date();
  const log = [...(user.savedPlans.workoutDailyLog || [])];
  const idx = log.findIndex((x) => x.date === date);
  const row = { date, percent: 0, completedBlocks: 0, totalBlocks };
  if (idx >= 0) log[idx] = row;
  else log.push(row);
  log.sort((a, b) => a.date.localeCompare(b.date));
  user.savedPlans.workoutDailyLog = log.slice(-120);
  await user.save();
}

/**
 * @param {string} userId
 * @param {{ markComplete?: boolean, completedBlocks?: number, date?: string }} body
 */
async function recordWorkoutDayProgress(userId, body) {
  const markComplete = Boolean(body?.markComplete);
  let completedBlocks = Number(body?.completedBlocks);
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.code = "NOT_FOUND";
    throw err;
  }
  const plan = user.savedPlans?.workoutPlan;
  const totalBlocks = Array.isArray(plan?.sections) ? plan.sections.length : 0;
  if (!totalBlocks) {
    const err = new Error("No saved workout plan");
    err.code = "NO_SAVED_WORKOUT";
    throw err;
  }
  const date =
    typeof body?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date
      : new Date().toISOString().slice(0, 10);
  if (markComplete) completedBlocks = totalBlocks;
  if (!Number.isFinite(completedBlocks)) completedBlocks = 0;
  completedBlocks = Math.min(totalBlocks, Math.max(0, completedBlocks));
  const percent = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
  const log = [...(user.savedPlans.workoutDailyLog || [])];
  const idx = log.findIndex((x) => x.date === date);
  const row = { date, percent, completedBlocks, totalBlocks };
  if (idx >= 0) log[idx] = row;
  else log.push(row);
  log.sort((a, b) => a.date.localeCompare(b.date));
  user.savedPlans.workoutDailyLog = log.slice(-120);
  await user.save();
  return row;
}

module.exports = {
  saveDietPlanToUser,
  saveWeeklyMealsToUser,
  saveWorkoutPlanToUser,
  recordWorkoutDayProgress,
};
