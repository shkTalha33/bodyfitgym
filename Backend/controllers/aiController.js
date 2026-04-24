const axios = require("axios");
const { goalLabel, activityLabel, dietLabel, buildCoachContext } = require("../utils/userProfile");

const AI_AGENT_URL = process.env.AI_AGENT_URL || "http://localhost:8000";
/** Groq free tier — https://console.groq.com (set GROQ_API_KEY on the ai-agent) */
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function extractBalancedJsonObject(text) {
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === "\\") escape = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === "{") depth += 1;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function stripTrailingCommasJson(s) {
  return s.replace(/,(\s*[}\]])/g, "$1");
}

function extractJsonFromAiText(text) {
  if (text != null && typeof text === "object" && !Array.isArray(text)) {
    return text;
  }
  if (!text || typeof text !== "string") return null;
  const trimmed = text.replace(/^\uFEFF/, "").trim();
  const attempts = [];
  attempts.push(trimmed);
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) attempts.push(fence[1].trim());
  const balanced = extractBalancedJsonObject(trimmed);
  if (balanced) {
    attempts.push(balanced);
    attempts.push(stripTrailingCommasJson(balanced));
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) attempts.push(trimmed.slice(start, end + 1));

  for (const candidate of attempts) {
    if (!candidate) continue;
    try {
      return JSON.parse(candidate);
    } catch {
      /* try next */
    }
  }
  return null;
}

function normalizeDietPlanPayload(raw, { weight, height, goal, activity }) {
  const w = Number(weight) || 70;
  const defaultHydration = Math.max(2.5, w * 0.04);
  const baseCal = Math.round(Number(raw.dailyCalories) || w * 30);

  const m = raw.macrosPct || raw.macros || {};
  let protein = Number(m.protein);
  let carbs = Number(m.carbs);
  let fats = Number(m.fats);
  if (!Number.isFinite(protein)) protein = 34;
  if (!Number.isFinite(carbs)) carbs = 36;
  if (!Number.isFinite(fats)) fats = 30;
  const sum = protein + carbs + fats;
  if (sum > 0) {
    protein = Math.round((protein / sum) * 100);
    carbs = Math.round((carbs / sum) * 100);
    fats = Math.max(0, 100 - protein - carbs);
  }

  let plans = Array.isArray(raw.plans) ? raw.plans : [];
  plans = plans
    .filter((p) => p && typeof p === "object")
    .slice(0, 3)
    .map((p) => ({
      title: String(p.title || "Plan").trim() || "Plan",
      calories: Math.round(Number(p.calories) || baseCal),
      meals: String(p.meals || "—").trim() || "—",
      schedule: String(p.schedule || "—").trim() || "—",
    }));

  const titles = ["Primary Plan", "Office Day Plan", "Training Day Plan"];
  while (plans.length < 3) {
    const i = plans.length;
    plans.push({
      title: titles[i] || `Plan ${i + 1}`,
      calories: baseCal + (i === 2 ? 120 : i === 1 ? -80 : 0),
      meals: i === 1 ? "4 meals/day" : "5 meals/day",
      schedule: "—",
    });
  }

  return {
    dailyCalories: baseCal,
    macrosPct: { protein, carbs, fats },
    hydrationLiters: Math.max(1.5, Number(raw.hydrationLiters) || defaultHydration),
    preWorkoutWindow: String(raw.preWorkoutWindow || "90 min before training").trim() || "90 min before training",
    plans,
    meta: {
      weightKg: w,
      heightCm: Number(height) || 175,
      goal: String(goal || ""),
      activity: String(activity || ""),
    },
  };
}

const WEEKDAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MEAL_KCAL_FRACTIONS = [
  ["breakfast", 0.25],
  ["lunch", 0.35],
  ["dinner", 0.4],
];

function mealMacroPercentsForStyle(style) {
  const s = String(style || "").toLowerCase();
  if (s.includes("keto")) return { p: 0.22, c: 0.06, f: 0.72 };
  if (s.includes("low") && s.includes("carb")) return { p: 0.35, c: 0.25, f: 0.4 };
  if (s.includes("high") && s.includes("prot")) return { p: 0.35, c: 0.4, f: 0.25 };
  return { p: 0.3, c: 0.45, f: 0.25 };
}

function splitDailyMacrosGrams(dailyKcal, style) {
  const { p, c, f } = mealMacroPercentsForStyle(style);
  return {
    proteinG: Math.round((dailyKcal * p) / 4),
    carbsG: Math.round((dailyKcal * c) / 4),
    fatG: Math.round((dailyKcal * f) / 9),
  };
}

function allocateMealsFromDayTarget(dailyKcal, style) {
  const dm = splitDailyMacrosGrams(dailyKcal, style);
  const out = {};
  let sumCal = 0;
  let sumP = 0;
  let sumC = 0;
  let sumF = 0;
  for (let i = 0; i < MEAL_KCAL_FRACTIONS.length; i++) {
    const [name, frac] = MEAL_KCAL_FRACTIONS[i];
    const isLast = i === MEAL_KCAL_FRACTIONS.length - 1;
    let calories = Math.round(dailyKcal * frac);
    let proteinG = Math.round(dm.proteinG * frac);
    let carbsG = Math.round(dm.carbsG * frac);
    let fatG = Math.round(dm.fatG * frac);
    if (isLast) {
      calories = Math.max(0, dailyKcal - sumCal);
      proteinG = Math.max(0, dm.proteinG - sumP);
      carbsG = Math.max(0, dm.carbsG - sumC);
      fatG = Math.max(0, dm.fatG - sumF);
    }
    sumCal += calories;
    sumP += proteinG;
    sumC += carbsG;
    sumF += fatG;
    out[name] = { calories, proteinG, carbsG, fatG };
  }
  return out;
}

function readNumeric(...vals) {
  for (const v of vals) {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return NaN;
}

function normalizeMealSlot(raw, fallback) {
  const base = fallback || { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
  let food = "—";
  let calories = NaN;
  let proteinG = NaN;
  let carbsG = NaN;
  let fatG = NaN;

  if (typeof raw === "string") {
    food = raw.trim() || "—";
  } else if (raw && typeof raw === "object") {
    food =
      String(raw.food ?? raw.description ?? raw.text ?? raw.label ?? raw.name ?? "").trim() || "—";
    calories = readNumeric(raw.calories, raw.kcal, raw.cal);
    proteinG = readNumeric(raw.proteinG, raw.protein, raw.protein_g, raw.p);
    carbsG = readNumeric(raw.carbsG, raw.carbs, raw.carbohydrates, raw.c);
    fatG = readNumeric(raw.fatG, raw.fat, raw.fats, raw.f);
  }

  if (!food || food === "—") {
    const strFallback = typeof raw === "string" ? raw.trim() : "";
    if (strFallback) food = strFallback;
  }

  if (!Number.isFinite(calories)) calories = base.calories;
  if (!Number.isFinite(proteinG) || !Number.isFinite(carbsG) || !Number.isFinite(fatG)) {
    const r = base.calories > 0 ? calories / base.calories : 1;
    if (!Number.isFinite(proteinG)) proteinG = Math.max(0, Math.round(base.proteinG * r));
    if (!Number.isFinite(carbsG)) carbsG = Math.max(0, Math.round(base.carbsG * r));
    if (!Number.isFinite(fatG)) fatG = Math.max(0, Math.round(base.fatG * r));
  }

  const kcalFromMacros = proteinG * 4 + carbsG * 4 + fatG * 9;
  if (kcalFromMacros > 0 && Math.abs(kcalFromMacros - calories) > calories * 0.2 + 80) {
    const r2 = calories / kcalFromMacros;
    proteinG = Math.max(0, Math.round(proteinG * r2));
    carbsG = Math.max(0, Math.round(carbsG * r2));
    fatG = Math.max(0, Math.round(fatG * r2));
  }

  return { food, calories, proteinG, carbsG, fatG };
}

function normalizeWeeklyMealsPayload(raw, { targetDailyKcal, style }) {
  const dailyKcal = Math.max(800, Math.min(6000, Number(targetDailyKcal) || 2200));
  const list = Array.isArray(raw.days) ? raw.days : [];
  const map = new Map();
  for (const d of list) {
    if (d && d.day) map.set(String(d.day).trim(), d);
  }
  return WEEKDAY_ORDER.map((dayName, idx) => {
    const d = map.get(dayName) || list[idx] || {};
    const allocated = allocateMealsFromDayTarget(dailyKcal, style);

    const breakfastRaw = d.breakfast ?? d.Breakfast;
    const lunchRaw = d.lunch ?? d.Lunch;
    const dinnerRaw = d.dinner ?? d.Dinner;

    const breakfast = normalizeMealSlot(breakfastRaw, allocated.breakfast);
    const lunch = normalizeMealSlot(lunchRaw, allocated.lunch);
    const dinner = normalizeMealSlot(dinnerRaw, allocated.dinner);

    const dailyTotals = {
      calories: breakfast.calories + lunch.calories + dinner.calories,
      proteinG: breakfast.proteinG + lunch.proteinG + dinner.proteinG,
      carbsG: breakfast.carbsG + lunch.carbsG + dinner.carbsG,
      fatG: breakfast.fatG + lunch.fatG + dinner.fatG,
    };

    const drift = dailyKcal - dailyTotals.calories;
    if (Math.abs(drift) >= 15 && dinner.calories > 0) {
      const prevD = dinner.calories;
      dinner.calories = Math.max(0, dinner.calories + drift);
      const scale = dinner.calories / prevD;
      dinner.proteinG = Math.max(0, Math.round(dinner.proteinG * scale));
      dinner.carbsG = Math.max(0, Math.round(dinner.carbsG * scale));
      dinner.fatG = Math.max(0, Math.round(dinner.fatG * scale));
      dailyTotals.calories = breakfast.calories + lunch.calories + dinner.calories;
      dailyTotals.proteinG = breakfast.proteinG + lunch.proteinG + dinner.proteinG;
      dailyTotals.carbsG = breakfast.carbsG + lunch.carbsG + dinner.carbsG;
      dailyTotals.fatG = breakfast.fatG + lunch.fatG + dinner.fatG;
    }

    return {
      day: dayName,
      breakfast,
      lunch,
      dinner,
      dailyTotals,
    };
  });
}

function normalizeWorkoutPlanPayload(raw) {
  const title = String(raw.title || "Workout plan").trim() || "Workout plan";
  const overview = raw.overview ? String(raw.overview).trim().slice(0, 400) : "";

  const mapExercise = (e) => {
    if (!e || typeof e !== "object") return null;
    const name = String(e.name || e.exercise || "Exercise").trim() || "Exercise";
    const sets = e.sets != null && e.sets !== "" ? e.sets : "—";
    const reps = String(e.reps ?? e.rep ?? "—").trim() || "—";
    const rest = e.rest != null ? String(e.rest).trim() : "";
    const rawTip = e.tip || e.instructions || e.note ? String(e.tip || e.instructions || e.note).trim() : "";
    const defaultTip =
      "Control the lowering phase, keep joints stacked, and breathe steadily—stop the set before form falls apart.";
    const tip = (rawTip || defaultTip).slice(0, 220);
    return { name, sets, reps, rest, tip };
  };

  let sections = Array.isArray(raw.sections) ? raw.sections : [];
  sections = sections
    .filter((s) => s && typeof s === "object")
    .map((s) => {
      const secTitle = String(s.title || s.name || "Section").trim() || "Section";
      const rawEx = Array.isArray(s.exercises) ? s.exercises : Array.isArray(s.items) ? s.items : [];
      const exercises = rawEx.map(mapExercise).filter(Boolean);
      return { title: secTitle, exercises };
    })
    .filter((s) => s.exercises.length > 0);

  if (sections.length === 0 && Array.isArray(raw.exercises)) {
    const exercises = raw.exercises.map(mapExercise).filter(Boolean);
    if (exercises.length) sections = [{ title: "Workout", exercises }];
  }

  return { title, overview, sections };
}

async function callGroqJson(systemContent, userContent, maxTokens) {
  const response = await axios.post(`${AI_AGENT_URL}/api/agent/groq`, {
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userContent },
    ],
    model: GROQ_MODEL,
    max_tokens: maxTokens,
  });
  const rawText = response.data.response;
  const asString = rawText == null ? "" : String(rawText).trim();
  if (asString.startsWith("Error from AI Coach")) {
    const err = new Error(asString.slice(0, 280));
    err.code = "GROQ_ERROR";
    throw err;
  }
  const parsed = extractJsonFromAiText(rawText);
  return { parsed, asString };
}

// --- Diet Plan Controller ---
exports.generateDietPlan = async (req, res, next) => {
  try {
    const u = req.profileUser;
    const weight = u.stats.weightKg;
    const height = u.stats.heightCm;
    const goal = goalLabel(u.stats.goal);
    const activity = activityLabel(u.preferences.activityLevel);
    const dietPreference = dietLabel(u.preferences.dietType);
    const dailyKcalTarget = u.preferences.targetCalories;

    const prompt = `You are a sports nutrition assistant. For this user, compute a practical day plan and respond with ONLY valid JSON (no markdown, no code fences, no extra text).

User profile (saved in app):
- Weight: ${weight} kg
- Height: ${height} cm
- Goal: ${goal}
- Activity level: ${activity}
- Diet preference: ${dietPreference}
- Typical daily calorie target they use in the app: ~${dailyKcalTarget} kcal (align dailyCalories and plans with this when sensible)

JSON shape (all keys required):
{
  "dailyCalories": <number, total kcal/day>,
  "macrosPct": { "protein": <number>, "carbs": <number>, "fats": <number> },
  "hydrationLiters": <number, daily water in L>,
  "preWorkoutWindow": "<short string, e.g. 60–90 min before training>",
  "plans": [
    { "title": "Primary Plan", "calories": <number>, "meals": "<e.g. 5 meals/day>", "schedule": "<comma-separated times>" },
    { "title": "Office Day Plan", "calories": <number>, "meals": "<string>", "schedule": "<string>" },
    { "title": "Training Day Plan", "calories": <number>, "meals": "<string>", "schedule": "<string>" }
  ]
}

Rules: macrosPct values should be percentages that sum to about 100. Include exactly 3 objects in "plans". Keep strings short.`;

    const response = await axios.post(`${AI_AGENT_URL}/api/agent/groq`, {
      messages: [
        {
          role: "system",
          content:
            "You are a nutrition planning API. Output one valid JSON object only. No markdown fences, no text before or after the JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: GROQ_MODEL,
      max_tokens: 2048,
    });

    const rawText = response.data.response;
    const asString = rawText == null ? "" : String(rawText).trim();
    if (asString.startsWith("Error from AI Coach")) {
      return res.status(502).json({
        success: false,
        message: asString.slice(0, 280) || "Diet plan service returned an error.",
      });
    }

    const parsed = extractJsonFromAiText(rawText);
    if (!parsed || typeof parsed !== "object") {
      console.error("Diet plan JSON parse failed. Raw snippet:", asString.slice(0, 400));
      return res.status(502).json({
        success: false,
        message: "Could not parse diet plan. Try again.",
      });
    }

    const data = normalizeDietPlanPayload(parsed, { weight, height, goal, activity });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("AI Diet Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate diet plan. Make sure the AI Agent is running on port 8000.",
    });
  }
};

// --- Weekly 7-day meals (JSON for table UI) ---
exports.generateWeeklyMeals = async (req, res, next) => {
  try {
    const u = req.profileUser;
    const kcal = Number(u.preferences.targetCalories) || 2200;
    const meals = Number(u.preferences.mealsPerDay) || 3;
    const planStyleLabel = `${dietLabel(u.preferences.planStyle)} (overall diet pattern: ${dietLabel(u.preferences.dietType)})`;
    const memberGoal = goalLabel(u.stats.goal);

    const prompt = `Create one week of meals (Monday through Sunday) for this member:
- Target about ${kcal} kcal per day TOTAL (sum of breakfast+lunch+dinner should be close to ${kcal})
- Roughly ${meals} eating occasions per day (breakfast, lunch, dinner as three entries; mention snacks inside the meal text if needed)
- Plan style: ${planStyleLabel}
- Training goal: ${memberGoal}

Return ONLY valid JSON. Each meal MUST be an object with food text AND estimated macros for that meal only.
Approximate calorie split: breakfast ~25%, lunch ~35%, dinner ~40% of daily ${kcal} kcal.

Shape:
{
  "days": [
    {
      "day": "Monday",
      "breakfast": { "food": "short description", "calories": <number>, "proteinG": <number>, "carbsG": <number>, "fatG": <number> },
      "lunch": { "food": "...", "calories": <number>, "proteinG": <number>, "carbsG": <number>, "fatG": <number> },
      "dinner": { "food": "...", "calories": <number>, "proteinG": <number>, "carbsG": <number>, "fatG": <number> }
    },
    ... through Sunday ...
  ]
}
Use exact English day names Monday..Sunday. Keep each "food" under 140 characters. Macros should be realistic for the foods. No markdown.`;

    let parsed;
    try {
      const out = await callGroqJson(
        "You output one valid JSON object only. No markdown fences, no extra text.",
        prompt,
        4096
      );
      parsed = out.parsed;
      if (!parsed || typeof parsed !== "object") {
        console.error("Weekly meals JSON parse failed:", out.asString.slice(0, 400));
        return res.status(502).json({ success: false, message: "Could not parse meal plan. Try again." });
      }
    } catch (e) {
      if (e.code === "GROQ_ERROR") {
        return res.status(502).json({ success: false, message: e.message });
      }
      throw e;
    }

    const data = {
      days: normalizeWeeklyMealsPayload(parsed, { targetDailyKcal: kcal, style: u.preferences.dietType }),
    };
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Weekly meals error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate weekly meals. Is the AI agent running?",
    });
  }
};

// --- Workout Plan Controller ---
exports.generateWorkoutPlan = async (req, res, next) => {
  try {
    const u = req.profileUser;
    const fitnessType = u.preferences.fitnessLevel;
    const goalType = goalLabel(u.stats.goal);
    const equipment = dietLabel(u.preferences.equipment);
    const sessionMinutes = u.preferences.sessionMinutes;
    const days = Array.isArray(u.preferences.workoutFocus) ? u.preferences.workoutFocus : [];
    const muscle = days.join(", ");

    const prompt = `Build a single structured workout for one session for this member:
- Experience: ${fitnessType}
- Goal: ${goalType}
- Equipment available: ${equipment}
- Session length: ${sessionMinutes} minutes
- Preferred muscle groups / focus: ${muscle}

Return ONLY valid JSON:
{
  "title": "short workout title",
  "overview": "one sentence summary (optional)",
  "sections": [
    {
      "title": "Warm-up",
      "exercises": [ { "name": "exercise name", "sets": 1, "reps": "5 min or reps", "rest": "optional", "tip": "required" } ]
    },
    {
      "title": "Main work (e.g. Chest)",
      "exercises": [ { "name": "...", "sets": 3, "reps": "12,10,8", "rest": "60-90 sec", "tip": "required" } ]
    }
  ]
}
Use 3-6 sections max (warm-up, main blocks, cardio if needed, cool-down). Every exercise MUST include "tip": a single string of 2-3 short sentences (max ~220 characters) on best execution: setup, range of motion, tempo or breathing, and one mistake to avoid. No markdown.`;

    let parsed;
    try {
      const out = await callGroqJson(
        "You are a strength coach API. Output one valid JSON object only. No markdown, no code fences.",
        prompt,
        4096
      );
      parsed = out.parsed;
      if (!parsed || typeof parsed !== "object") {
        console.error("Workout JSON parse failed:", out.asString.slice(0, 400));
        return res.status(502).json({ success: false, message: "Could not parse workout plan. Try again." });
      }
    } catch (e) {
      if (e.code === "GROQ_ERROR") {
        return res.status(502).json({ success: false, message: e.message });
      }
      throw e;
    }

    const data = normalizeWorkoutPlanPayload(parsed);
    if (!data.sections.length) {
      return res.status(502).json({ success: false, message: "Workout plan was empty. Try again." });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("AI Workout Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate workout plan.",
    });
  }
};

const COACH_RECENT_MESSAGE_CAP = 12;
const COACH_SUMMARY_MAX_CHARS = 8000;
const COACH_MESSAGE_CONTENT_MAX = 32000;

function sanitizeCoachMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = m.role === "user" || m.role === "assistant" ? m.role : null;
    if (!role) continue;
    let content = typeof m.content === "string" ? m.content : "";
    if (content.length > COACH_MESSAGE_CONTENT_MAX) {
      content = content.slice(0, COACH_MESSAGE_CONTENT_MAX);
    }
    out.push({ role, content });
  }
  return out.slice(-COACH_RECENT_MESSAGE_CAP);
}

// --- AI Coach Controller (Chat) ---
exports.aiCoach = async (req, res, next) => {
  try {
    const { messages, conversationSummary } = req.body;
    const recent = sanitizeCoachMessages(messages);
    if (recent.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Send at least one valid user or assistant message.",
      });
    }
    let summary =
      typeof conversationSummary === "string" ? conversationSummary.trim() : "";
    if (summary.length > COACH_SUMMARY_MAX_CHARS) {
      summary = summary.slice(0, COACH_SUMMARY_MAX_CHARS);
    }

    const context = buildCoachContext(req.profileUser, summary || undefined);
    const augmented = [{ role: "system", content: context }, ...recent];

    const response = await axios.post(`${AI_AGENT_URL}/api/agent/groq`, {
      messages: augmented,
      model: GROQ_MODEL,
      max_tokens: 2048,
    });

    res.status(200).json({
      success: true,
      data: response.data.response,
    });
  } catch (error) {
    console.error("AI Coach Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI Coach is currently unavailable.",
    });
  }
};
