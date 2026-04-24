"use client";

import api from "@/lib/api";
import {
  ACTIVITY_OPTIONS,
  AGE_OPTIONS,
  CALORIE_OPTIONS,
  DIET_OPTIONS,
  EQUIPMENT_OPTIONS,
  FITNESS_OPTIONS,
  GOAL_OPTIONS,
  HEIGHT_OPTIONS,
  MEALS_PER_DAY_OPTIONS,
  MUSCLE_OPTIONS,
  PLAN_STYLE_OPTIONS,
  SESSION_MIN_OPTIONS,
  WEIGHT_OPTIONS,
} from "@/lib/profile-options";
import { normalizeUser, type AuthUser } from "@/lib/user-normalize";
import { setAuthUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/hooks/redux";
import { Button, Input } from "@heroui/react";
import { useEffect, useState } from "react";

const selectClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#F41E1E]/40";

const inputClass = "mt-1 bg-[var(--surface-soft)]";

type Props = {
  initialUser: AuthUser | null;
  onSuccess: (user: AuthUser) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  intro?: string | null;
};

export default function ProfilePreferencesForm({
  initialUser,
  onSuccess,
  onCancel,
  submitLabel = "Save profile",
  cancelLabel = "Cancel",
  showCancel = false,
  intro = "Choose from the lists so AI features match your goals. Email cannot be changed here.",
}: Props) {
  const dispatch = useAppDispatch();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [emailDisplay, setEmailDisplay] = useState("");
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(25);
  const [goal, setGoal] = useState("fat_loss");
  const [fitnessLevel, setFitnessLevel] = useState("beginner");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [dietType, setDietType] = useState("high_protein");
  const [planStyle, setPlanStyle] = useState("high_protein");
  const [targetCalories, setTargetCalories] = useState(2200);
  const [mealsPerDay, setMealsPerDay] = useState("3");
  const [equipment, setEquipment] = useState("dumbbells");
  const [sessionMinutes, setSessionMinutes] = useState("60");
  const [workoutFocus, setWorkoutFocus] = useState<string[]>(["chest", "legs"]);

  useEffect(() => {
    if (!initialUser) return;
    setDisplayName(initialUser.name || "");
    setEmailDisplay(initialUser.email || "");
    const s = initialUser.stats;
    const p = initialUser.preferences;
    if (s?.weightKg) setWeightKg(s.weightKg);
    if (s?.heightCm) setHeightCm(s.heightCm);
    if (s?.age) setAge(s.age);
    if (s?.goal) setGoal(s.goal);
    if (p?.fitnessLevel) setFitnessLevel(p.fitnessLevel);
    if (p?.activityLevel) setActivityLevel(p.activityLevel);
    if (p?.dietType) setDietType(p.dietType);
    if (p?.planStyle) setPlanStyle(p.planStyle);
    if (p?.targetCalories) setTargetCalories(p.targetCalories);
    if (p?.mealsPerDay) setMealsPerDay(p.mealsPerDay);
    if (p?.equipment) setEquipment(p.equipment);
    if (p?.sessionMinutes) setSessionMinutes(p.sessionMinutes);
    if (p?.workoutFocus?.length) setWorkoutFocus([...p.workoutFocus]);
  }, [initialUser]);

  const toggleMuscle = (v: string) => {
    setWorkoutFocus((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const handleSave = async () => {
    if (workoutFocus.length === 0) {
      setError("Pick at least one workout focus area.");
      return;
    }
    const nameTrim = displayName.trim();
    if (nameTrim.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.patch("/users/me", {
        name: nameTrim,
        stats: { weightKg, heightCm, age, goal },
        preferences: {
          fitnessLevel,
          activityLevel,
          dietType,
          planStyle,
          targetCalories,
          mealsPerDay,
          equipment,
          sessionMinutes,
          workoutFocus,
        },
      });
      const u = normalizeUser(data as Record<string, unknown>);
      if (!u) throw new Error("Invalid profile response");
      dispatch(setAuthUser(u));
      onSuccess(u);
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(typeof msg === "string" ? msg : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {intro ? <p className="text-xs text-neutral-500">{intro}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-300">Full name</p>
          <Input className={inputClass} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <p className="text-sm text-slate-300">Email</p>
          <Input
            className={`${inputClass} opacity-90`}
            value={emailDisplay}
            readOnly
            disabled
            title="Email cannot be changed here"
            aria-readonly="true"
          />
        </div>
        <label className="text-sm text-slate-300">
          Weight (kg)
          <select className={selectClass} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))}>
            {WEIGHT_OPTIONS.map((w) => (
              <option key={w} value={w} className="bg-neutral-900">
                {w} kg
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Height (cm)
          <select className={selectClass} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))}>
            {HEIGHT_OPTIONS.map((h) => (
              <option key={h} value={h} className="bg-neutral-900">
                {h} cm
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Age
          <select className={selectClass} value={age} onChange={(e) => setAge(Number(e.target.value))}>
            {AGE_OPTIONS.map((a) => (
              <option key={a} value={a} className="bg-neutral-900">
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Primary goal
          <select className={selectClass} value={goal} onChange={(e) => setGoal(e.target.value)}>
            {GOAL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-neutral-900">
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Fitness level
          <select className={selectClass} value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)}>
            {FITNESS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-neutral-900">
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Daily activity
          <select className={selectClass} value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
            {ACTIVITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-neutral-900">
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Eating pattern
          <select className={selectClass} value={dietType} onChange={(e) => setDietType(e.target.value)}>
            {DIET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-neutral-900">
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Weekly meal style
          <select className={selectClass} value={planStyle} onChange={(e) => setPlanStyle(e.target.value)}>
            {PLAN_STYLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-neutral-900">
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Daily calorie target
          <select className={selectClass} value={targetCalories} onChange={(e) => setTargetCalories(Number(e.target.value))}>
            {CALORIE_OPTIONS.map((c) => (
              <option key={c} value={c} className="bg-neutral-900">
                {c} kcal
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Main meals / day
          <select className={selectClass} value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)}>
            {MEALS_PER_DAY_OPTIONS.map((m) => (
              <option key={m} value={m} className="bg-neutral-900">
                {m} meals
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Gym equipment
          <select className={selectClass} value={equipment} onChange={(e) => setEquipment(e.target.value)}>
            {EQUIPMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-neutral-900">
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Typical workout length
          <select className={selectClass} value={sessionMinutes} onChange={(e) => setSessionMinutes(e.target.value)}>
            {SESSION_MIN_OPTIONS.map((m) => (
              <option key={m} value={m} className="bg-neutral-900">
                {m} minutes
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <p className="text-sm text-slate-300">Workout focus (pick one or more)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MUSCLE_OPTIONS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => toggleMuscle(m.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                workoutFocus.includes(m.value) ? "bg-[#F41E1E] text-white" : "bg-[var(--surface-soft)] text-neutral-400"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:justify-end">
        {showCancel && onCancel ? (
          <Button type="button" className="rounded-xl border border-[var(--border)] bg-transparent text-white" onClick={onCancel}>
            {cancelLabel}
          </Button>
        ) : null}
        <Button
          type="button"
          className="rounded-xl bg-[#F41E1E] font-semibold text-white hover:opacity-95"
          onClick={handleSave}
          isDisabled={saving}
        >
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
