const User = require("../models/User");
const Conversation = require("../models/Conversation");
const env = require("../config/env");
const { getWalletSummary, sumUniquePositiveAmounts } = require("../services/walletService");

const TX_OK = new Set(["COMPLETE", "CONFIRMED"]);

function rolling7DayLabels() {
  const rows = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    rows.push({ day: labels[d.getUTCDay()], date: iso, usdc: 0 });
  }
  return rows;
}

/** Confirmed USDC sent to merchant address, bucketed by UTC calendar day (last 7 days). */
function buildSpendingLast7Days(transactions, merchantAddress) {
  const merchant = (merchantAddress || "").toLowerCase();
  const rows = rolling7DayLabels();
  const isoSet = new Set(rows.map((r) => r.date));
  for (const t of transactions || []) {
    if (!merchant || !t.destinationAddress) continue;
    if (String(t.destinationAddress).toLowerCase() !== merchant) continue;
    if (!t.state || !TX_OK.has(String(t.state).toUpperCase())) continue;
    const dt = t.createDate ? new Date(t.createDate) : null;
    if (!dt || Number.isNaN(dt.getTime())) continue;
    const iso = dt.toISOString().slice(0, 10);
    if (!isoSet.has(iso)) continue;
    const sum = sumUniquePositiveAmounts(t.amounts);
    const row = rows.find((r) => r.date === iso);
    if (row) row.usdc += sum;
  }
  return rows;
}

function buildRecs({ goal, targetCal, fitness, hydrationL, convoCount }) {
  const out = [];
  out.push({
    title: "Nutrition anchor",
    body: `Your saved daily calorie target is ${targetCal} kcal.`,
  });
  if (goal === "fat_loss") {
    out.push({
      title: "Fat-loss pace",
      body: "Moderate deficit with adequate protein matches your saved goal—keep steps and sleep consistent.",
    });
  } else if (goal === "muscle_gain") {
    out.push({
      title: "Hypertrophy focus",
      body: "Progressive overload and hitting your calorie target supports your muscle gain goal.",
    });
  } else {
    out.push({
      title: "Maintenance",
      body: "Hold a steady intake week to week while monitoring performance and scale trend.",
    });
  }
  out.push({
    title: "Hydration",
    body: `From your profile weight, plan roughly ${hydrationL} L fluids per day (rough estimate).`,
  });
  if (convoCount > 0) {
    out.push({
      title: "Coach",
      body: `${convoCount} coach conversation(s) on your account—reuse a thread for richer context.`,
    });
  }
  return out.slice(0, 3);
}

const getDashboardSummary = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash -refreshTokens").lean();
  if (!user) return res.status(404).json({ message: "User not found" });

  const p = user.preferences || {};
  const s = user.stats || {};
  const targetCal = Number(p.targetCalories) || 2000;
  const weight = Number(s.weightKg) || 70;
  const height = Number(s.heightCm) || 175;
  const activity = p.activityLevel || "moderate";
  const fitness = p.fitnessLevel || "beginner";
  const goal = s.goal || "fat_loss";

  const stepsEst = activity === "high" ? 10400 : activity === "low" ? 5800 : 8200;

  const log = user.savedPlans?.workoutDailyLog || [];
  const byDate = Object.fromEntries(log.map((x) => [x.date, x]));
  const workoutDailyTrend = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const w = d.getUTCDay();
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const entry = byDate[iso];
    workoutDailyTrend.push({
      day: labels[w],
      date: iso,
      percent: entry ? entry.percent : 0,
      completedBlocks: entry ? entry.completedBlocks : 0,
      totalBlocks: entry ? entry.totalBlocks : 0,
    });
  }

  const sp = user.savedPlans || {};
  const savedPlansSummary = {
    hasDietPlan: Boolean(sp.dietPlan),
    hasWeeklyMeals: Boolean(sp.weeklyMeals?.days?.length),
    hasWorkoutPlan: Boolean(sp.workoutPlan?.sections?.length),
    dietPlanSavedAt: sp.dietPlanSavedAt || null,
    weeklyMealsSavedAt: sp.weeklyMealsSavedAt || null,
    workoutPlanSavedAt: sp.workoutPlanSavedAt || null,
  };

  const focuses = Array.isArray(p.workoutFocus) ? p.workoutFocus.filter(Boolean) : [];
  const cols = ["#F41E1E", "#a3a3a3", "#525252", "#737373", "#404040"];
  let workoutSplit = [];
  if (focuses.length) {
    const base = Math.floor(100 / focuses.length);
    let rem = 100 - base * focuses.length;
    workoutSplit = focuses.map((name, i) => ({
      name: String(name).replace(/_/g, " "),
      value: base + (rem-- > 0 ? 1 : 0),
      color: cols[i % cols.length],
    }));
  } else {
    workoutSplit = [{ name: "Training", value: 100, color: "#F41E1E" }];
  }

  const trainingLoad = fitness === "advanced" ? 88 : fitness === "intermediate" ? 76 : 64;
  const hydrationL = Math.max(1.8, Math.round(weight * 0.035 * 10) / 10);

  const [convoCount, lastConvo] = await Promise.all([
    Conversation.countDocuments({ userId: user._id }),
    Conversation.findOne({ userId: user._id }).sort({ updatedAt: -1 }).select("updatedAt").lean(),
  ]);

  let walletSnippet = null;
  let spendingTrend = buildSpendingLast7Days([], env.circleMerchantWalletAddress);
  if (user.walletId && env.circleApiKey && env.circleEntitySecret) {
    try {
      const w = await getWalletSummary(user.walletId, env.circleMerchantWalletAddress);
      spendingTrend = buildSpendingLast7Days(w.transactions, env.circleMerchantWalletAddress);
      const weekMs = 7 * 86400000;
      const now = Date.now();
      walletSnippet = {
        currentBalanceUsdc: w.currentBalanceUsdc,
        totalSpentUsdc: w.totalSpentUsdc,
        txCount7d: w.transactions.filter((t) => {
          const d = t.createDate ? new Date(t.createDate) : null;
          if (!d || Number.isNaN(d.getTime())) return false;
          return now - d.getTime() < weekMs;
        }).length,
      };
    } catch (_) {
      walletSnippet = null;
    }
  }

  const bmi = height > 0 ? Math.round((weight / (height / 100) ** 2) * 10) / 10 : null;

  return res.json({
    success: true,
    data: {
      spendingTrend,
      workoutDailyTrend,
      savedPlansSummary,
      workoutSplit,
      iconStats: {
        calorieTarget: targetCal,
        trainingLoad,
        stepsEstimate: stepsEst,
        hydrationLiters: hydrationL,
      },
      aiRecommendations: buildRecs({ goal, targetCal, fitness, hydrationL, convoCount }),
      wallet: walletSnippet,
      profileEcho: {
        goal,
        fitness,
        activity,
        weightKg: weight,
        heightCm: height,
        bmi,
      },
      activityMeta: {
        conversationCount: convoCount,
        lastCoachActivityAt: lastConvo?.updatedAt || null,
      },
    },
  });
};

module.exports = { getDashboardSummary };
