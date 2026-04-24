const GOAL_LABELS = {
  fat_loss: "fat loss",
  muscle_gain: "muscle gain / bulking",
  maintain: "maintenance",
  recomp: "body recomposition",
};

const ALLOWED_GOALS = Object.keys(GOAL_LABELS);
const ALLOWED_FITNESS = ["beginner", "intermediate", "advanced"];
const ALLOWED_ACTIVITY = ["low", "moderate", "high"];
const ALLOWED_DIET = ["high_protein", "balanced", "low_carb", "vegetarian"];
const ALLOWED_PLAN_STYLES = ["high_protein", "balanced", "low_carb", "mediterranean", "flexible"];
const ALLOWED_EQUIPMENT = ["dumbbells", "barbell", "bodyweight", "full_gym", "cables"];
const ALLOWED_SESSION_MIN = ["30", "45", "60", "75", "90"];
const ALLOWED_MEALS_PER_DAY = ["3", "4", "5", "6"];
const ALLOWED_MUSCLE = ["chest", "back", "legs", "shoulders", "arms", "core"];

function clamp(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(max, Math.max(min, x));
}

function pickEnum(val, allowed, fallback = "") {
  const s = String(val || "").trim().toLowerCase().replace(/\s+/g, "_");
  if (allowed.includes(s)) return s;
  const normalized = String(val || "").trim().toLowerCase();
  const hit = allowed.find((a) => a === normalized || a.replace(/_/g, " ") === normalized);
  return hit || fallback;
}

function isProfileComplete(user) {
  if (!user) return false;
  const s = user.stats || {};
  const p = user.preferences || {};
  const w = Number(s.weightKg);
  const h = Number(s.heightCm);
  if (!Number.isFinite(w) || w < 35 || !Number.isFinite(h) || h < 120) return false;
  if (!s.goal || !ALLOWED_GOALS.includes(String(s.goal))) return false;
  if (!p.fitnessLevel || !ALLOWED_FITNESS.includes(String(p.fitnessLevel))) return false;
  if (!p.activityLevel || !ALLOWED_ACTIVITY.includes(String(p.activityLevel))) return false;
  if (!p.dietType || !ALLOWED_DIET.includes(String(p.dietType))) return false;
  const kcal = Number(p.targetCalories);
  if (!Number.isFinite(kcal) || kcal < 1200 || kcal > 5000) return false;
  if (!p.mealsPerDay || !ALLOWED_MEALS_PER_DAY.includes(String(p.mealsPerDay))) return false;
  if (!p.planStyle || !ALLOWED_PLAN_STYLES.includes(String(p.planStyle))) return false;
  if (!p.equipment || !ALLOWED_EQUIPMENT.includes(String(p.equipment))) return false;
  if (!p.sessionMinutes || !ALLOWED_SESSION_MIN.includes(String(p.sessionMinutes))) return false;
  const focus = Array.isArray(p.workoutFocus) ? p.workoutFocus : [];
  const clean = focus.filter((x) => ALLOWED_MUSCLE.includes(String(x)));
  if (clean.length === 0) return false;
  return true;
}

function goalLabel(code) {
  return GOAL_LABELS[String(code)] || String(code || "maintenance").replace(/_/g, " ");
}

function activityLabel(code) {
  const m = { low: "low activity", moderate: "moderate activity", high: "high activity" };
  return m[String(code)] || String(code);
}

function dietLabel(code) {
  return String(code || "").replace(/_/g, " ");
}

const COACH_CONVERSATION_RULES = [
  "CONVERSATION BEHAVIOR (follow strictly):",
  "1) Continuity: use the recent message thread as one continuous chat; keep flow and never ignore prior turns that appear in context.",
  "2) User memory: treat the MEMBER PROFILE section above as permanent truth; do not ask again for name, weight, goals, or other facts already given there; personalize all advice.",
  "3) Long context: when COMPRESSED PRIOR CONTEXT is present, use it only to recall older discussion; never quote or expose that block to the user; merge it naturally with recent messages.",
  "4) Relevance: answer the latest user message using profile + optional prior context + recent messages; stay precise and on-topic.",
  "5) No invention: only use information present in profile, compressed prior context, or messages; if something is unknown, say so briefly and ask only what you need.",
  "6) Consistency: follow the topic and tone of recent messages unless the user clearly changes subject.",
  "7) Sessions: if no compressed prior context is provided, rely only on the messages supplied in this request for chat history.",
  "Never tell the user about internal labels (profile, summary, database, context blocks, or \"your saved data\"). Write as a natural coach.",
].join("\n");

function buildCoachContext(user, conversationSummary) {
  const s = user.stats || {};
  const p = user.preferences || {};
  const focus = (Array.isArray(p.workoutFocus) ? p.workoutFocus : []).join(", ");
  const profileBlock = [
    "MEMBER PROFILE (authoritative; do not ask the user to repeat these facts):",
    `Name: ${user.name || "Member"}`,
    `Weight: ${s.weightKg} kg, height: ${s.heightCm} cm${s.age ? `, age: ${s.age}` : ""}.`,
    `Primary goal: ${goalLabel(s.goal)}.`,
    `Fitness level: ${p.fitnessLevel}, daily activity: ${activityLabel(p.activityLevel)}.`,
    `Nutrition: diet style ${dietLabel(p.dietType)}, ~${p.targetCalories} kcal/day, ${p.mealsPerDay} main meals, weekly plan style: ${dietLabel(p.planStyle)}.`,
    `Training: equipment ${String(p.equipment).replace(/_/g, " ")}, typical session ${p.sessionMinutes} min, focus muscle groups: ${focus}.`,
    "If the user asks for something conflicting with their goal, acknowledge their situation and give safe, practical guidance.",
  ].join("\n");

  const parts = [
    "You are the Body Fit coaching assistant.",
    profileBlock,
  ];

  const sum = typeof conversationSummary === "string" ? conversationSummary.trim() : "";
  if (sum) {
    parts.push(
      "COMPRESSED PRIOR CONTEXT (internal only; do not repeat or summarize this block back to the user):\n" + sum
    );
  }

  parts.push(COACH_CONVERSATION_RULES);
  return parts.join("\n\n");
}

module.exports = {
  GOAL_LABELS,
  ALLOWED_GOALS,
  ALLOWED_FITNESS,
  ALLOWED_ACTIVITY,
  ALLOWED_DIET,
  ALLOWED_PLAN_STYLES,
  ALLOWED_EQUIPMENT,
  ALLOWED_SESSION_MIN,
  ALLOWED_MEALS_PER_DAY,
  ALLOWED_MUSCLE,
  clamp,
  pickEnum,
  isProfileComplete,
  goalLabel,
  activityLabel,
  dietLabel,
  buildCoachContext,
};
