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
import { Button, Input, Label, ListBox, Select } from "@heroui/react";
import { useEffect, useState } from "react";

const inputClass = "mt-1 bg-[var(--surface-soft)]";

const selectSurface = "mt-1 w-full max-w-full";

type Opt = { id: string; label: string };

function FieldSelect({
  label,
  selectedKey,
  onSelect,
  options,
}: {
  label: string;
  selectedKey: string;
  onSelect: (key: string) => void;
  options: Opt[];
}) {
  return (
    <div className="min-w-0">
      <Label className="text-sm text-slate-300">{label}</Label>
      <Select
        selectedKey={selectedKey}
        onSelectionChange={(key) => {
          if (key != null) onSelect(String(key));
        }}
        className={selectSurface}
        fullWidth
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="max-h-72">
          <ListBox>
            {options.map((o) => (
              <ListBox.Item key={o.id} id={o.id} textValue={o.label}>
                {o.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}

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
    queueMicrotask(() => {
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
    });
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

  const weightOpts: Opt[] = WEIGHT_OPTIONS.map((w) => ({ id: String(w), label: `${w} kg` }));
  const heightOpts: Opt[] = HEIGHT_OPTIONS.map((h) => ({ id: String(h), label: `${h} cm` }));
  const ageOpts: Opt[] = AGE_OPTIONS.map((a) => ({ id: String(a), label: String(a) }));
  const calOpts: Opt[] = CALORIE_OPTIONS.map((c) => ({ id: String(c), label: `${c} kcal` }));

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

        <FieldSelect label="Weight (kg)" selectedKey={String(weightKg)} onSelect={(k) => setWeightKg(Number(k))} options={weightOpts} />
        <FieldSelect label="Height (cm)" selectedKey={String(heightCm)} onSelect={(k) => setHeightCm(Number(k))} options={heightOpts} />
        <FieldSelect label="Age" selectedKey={String(age)} onSelect={(k) => setAge(Number(k))} options={ageOpts} />
        <FieldSelect
          label="Primary goal"
          selectedKey={goal}
          onSelect={setGoal}
          options={GOAL_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
        />
        <FieldSelect
          label="Fitness level"
          selectedKey={fitnessLevel}
          onSelect={setFitnessLevel}
          options={FITNESS_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
        />
        <FieldSelect
          label="Daily activity"
          selectedKey={activityLevel}
          onSelect={setActivityLevel}
          options={ACTIVITY_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
        />
        <FieldSelect
          label="Eating pattern"
          selectedKey={dietType}
          onSelect={setDietType}
          options={DIET_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
        />
        <FieldSelect
          label="Weekly meal style"
          selectedKey={planStyle}
          onSelect={setPlanStyle}
          options={PLAN_STYLE_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
        />
        <FieldSelect
          label="Daily calorie target"
          selectedKey={String(targetCalories)}
          onSelect={(k) => setTargetCalories(Number(k))}
          options={calOpts}
        />
        <FieldSelect
          label="Main meals / day"
          selectedKey={mealsPerDay}
          onSelect={setMealsPerDay}
          options={MEALS_PER_DAY_OPTIONS.map((m) => ({ id: m, label: `${m} meals` }))}
        />
        <FieldSelect
          label="Gym equipment"
          selectedKey={equipment}
          onSelect={setEquipment}
          options={EQUIPMENT_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
        />
        <FieldSelect
          label="Typical workout length"
          selectedKey={sessionMinutes}
          onSelect={setSessionMinutes}
          options={SESSION_MIN_OPTIONS.map((m) => ({ id: m, label: `${m} minutes` }))}
        />
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
