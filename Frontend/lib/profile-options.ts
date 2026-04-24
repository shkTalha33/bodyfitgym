/** Must match Backend/utils/userProfile.js allowed values */

export const WEIGHT_OPTIONS = Array.from({ length: 28 }, (_, i) => 40 + i * 5);
export const HEIGHT_OPTIONS = Array.from({ length: 18 }, (_, i) => 140 + i * 5);
export const AGE_OPTIONS = Array.from({ length: 53 }, (_, i) => 16 + i);

export const GOAL_OPTIONS = [
  { value: "fat_loss", label: "Fat loss" },
  { value: "muscle_gain", label: "Muscle gain / bulking" },
  { value: "maintain", label: "Maintain weight" },
  { value: "recomp", label: "Body recomposition" },
] as const;

export const FITNESS_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const ACTIVITY_OPTIONS = [
  { value: "low", label: "Low (mostly sedentary)" },
  { value: "moderate", label: "Moderate (3–4 sessions/week)" },
  { value: "high", label: "High (5+ sessions or physical job)" },
] as const;

export const DIET_OPTIONS = [
  { value: "high_protein", label: "High protein" },
  { value: "balanced", label: "Balanced" },
  { value: "low_carb", label: "Lower carb" },
  { value: "vegetarian", label: "Vegetarian" },
] as const;

export const PLAN_STYLE_OPTIONS = [
  { value: "high_protein", label: "High protein meals" },
  { value: "balanced", label: "Balanced meals" },
  { value: "low_carb", label: "Lower carb meals" },
  { value: "mediterranean", label: "Mediterranean-style" },
  { value: "flexible", label: "Flexible / varied" },
] as const;

export const CALORIE_OPTIONS = [1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200];

export const MEALS_PER_DAY_OPTIONS = ["3", "4", "5", "6"] as const;

export const EQUIPMENT_OPTIONS = [
  { value: "dumbbells", label: "Dumbbells only" },
  { value: "barbell", label: "Barbell & rack" },
  { value: "bodyweight", label: "Bodyweight" },
  { value: "full_gym", label: "Full gym" },
  { value: "cables", label: "Cables & machines" },
] as const;

export const SESSION_MIN_OPTIONS = ["30", "45", "60", "75", "90"] as const;

export const MUSCLE_OPTIONS = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "legs", label: "Legs" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "core", label: "Core" },
] as const;
