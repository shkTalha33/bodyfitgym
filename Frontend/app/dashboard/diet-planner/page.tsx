"use client";

import { AiModulePageSkeleton } from "@/components/app-skeletons";
import ProfilePreferencesModal from "@/components/profile-preferences-modal";
import api from "@/lib/api";
import { fetchProfileFresh } from "@/lib/fetch-profile";
import { optionLabel } from "@/lib/option-label";
import {
  ACTIVITY_OPTIONS,
  DIET_OPTIONS,
  FITNESS_OPTIONS,
  GOAL_OPTIONS,
  PLAN_STYLE_OPTIONS,
} from "@/lib/profile-options";
import { setAuthUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button, Card, ProgressBar } from "@heroui/react";
import { Clock, Flame, Timer, UtensilsCrossed } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function parseScheduleToSlots(schedule: string): string[] {
  return schedule
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function label(map: { value: string; label: string }[], v: string) {
  return map.find((x) => x.value === v)?.label ?? v.replace(/_/g, " ");
}

type DietPlanPayload = {
  dailyCalories: number;
  macrosPct: { protein: number; carbs: number; fats: number };
  hydrationLiters: number;
  preWorkoutWindow: string;
  plans: { title: string; calories: number; meals: string; schedule: string }[];
};

export default function DietPlannerPage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const [profileSnap, setProfileSnap] = useState(authUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<DietPlanPayload | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (authUser) setProfileSnap(authUser);
  }, [authUser]);

  useEffect(() => {
    void (async () => {
      try {
        const u = await fetchProfileFresh();
        dispatch(setAuthUser(u));
        setProfileSnap(u);
        const raw = u.savedPlans?.dietPlan;
        if (raw && typeof raw === "object" && raw !== null && "dailyCalories" in raw) {
          setGeneratedPlan(raw as DietPlanPayload);
        }
      } catch {
        /* not authenticated */
      } finally {
        setHydrated(true);
      }
    })();
  }, [dispatch]);

  const s = profileSnap?.stats;
  const p = profileSnap?.preferences;
  const goalKey = s?.goal || "fat_loss";

  const calories = useMemo(() => {
    const w = Number(s?.weightKg) || 70;
    const base = w * 30;
    const goalFactor = goalKey === "muscle_gain" ? 1.18 : goalKey === "maintain" ? 1 : 0.85;
    const act = p?.activityLevel || "moderate";
    const activityFactor = act === "high" ? 1.1 : act === "low" ? 0.92 : 1;
    return Math.round(base * goalFactor * activityFactor);
  }, [goalKey, s?.weightKg, p?.activityLevel]);

  const macroTargets = useMemo(() => {
    if (generatedPlan) {
      const { protein, carbs, fats } = generatedPlan.macrosPct;
      return [
        { label: "Protein", value: Math.min(100, Math.max(0, Math.round(protein))) },
        { label: "Carbs", value: Math.min(100, Math.max(0, Math.round(carbs))) },
        { label: "Fats", value: Math.min(100, Math.max(0, Math.round(fats))) },
      ];
    }
    if (goalKey === "muscle_gain") return [{ label: "Protein", value: 72 }, { label: "Carbs", value: 82 }, { label: "Fats", value: 54 }];
    if (goalKey === "maintain") return [{ label: "Protein", value: 74 }, { label: "Carbs", value: 72 }, { label: "Fats", value: 58 }];
    return [{ label: "Protein", value: 84 }, { label: "Carbs", value: 62 }, { label: "Fats", value: 52 }];
  }, [goalKey, generatedPlan]);

  const displayCalories = generatedPlan?.dailyCalories ?? p?.targetCalories ?? calories;
  const hydrationLiters =
    generatedPlan?.hydrationLiters ?? Math.max(2.5, Number(s?.weightKg || 0) * 0.04 || 2.5);
  const preWorkoutWindow = generatedPlan?.preWorkoutWindow ?? "90 min before training";

  const refreshProfile = useCallback(async () => {
    const u = await fetchProfileFresh();
    dispatch(setAuthUser(u));
    setProfileSnap(u);
    return u;
  }, [dispatch]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await refreshProfile();
      if (!me.profileComplete) {
        setModalOpen(true);
        setLoading(false);
        return;
      }
      const response = await api.post("/ai/diet-plan", {});
      const result = response.data;
      if (!result.success || !result.data) {
        setError(typeof result.message === "string" ? result.message : "Could not build your plan.");
        return;
      }
      setGeneratedPlan(result.data as DietPlanPayload);
    } catch (e: unknown) {
      const ax = e as { response?: { status?: number; data?: { code?: string; message?: string } } };
      if (ax.response?.status === 403 && ax.response.data?.code === "PROFILE_INCOMPLETE") {
        setModalOpen(true);
      } else if (ax.response?.status === 402) {
        setError(ax.response?.data?.message || "Add USDC to your wallet (Dashboard → Wallet) and try again.");
      } else {
        setError(ax.response?.data?.message || "Request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const plans = useMemo(() => {
    if (generatedPlan?.plans?.length) return generatedPlan.plans;
    const c = displayCalories;
    return [
      { title: "Primary Plan", calories: c - 40, meals: "5 meals/day", schedule: "6:30, 10:00, 13:00, 17:00, 20:00" },
      { title: "Office Day Plan", calories: c - 120, meals: "4 meals/day", schedule: "8:00, 12:30, 16:30, 20:30" },
      { title: "Training Day Plan", calories: c + 140, meals: "5 meals/day", schedule: "6:00, 9:30, 13:00, 17:30, 21:00" },
    ];
  }, [displayCalories, generatedPlan]);

  if (!hydrated) {
    return <AiModulePageSkeleton />;
  }

  return (
    <section className="space-y-4 pb-16 md:pb-4">
      <ProfilePreferencesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialUser={profileSnap}
        title="Complete your profile to build a diet plan"
        onSaved={(u) => {
          setProfileSnap(u);
          dispatch(setAuthUser(u));
        }}
      />

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="p-6">
          <p className="panel-heading">Macro Intelligence</p>
          <h2 className="text-2xl font-semibold text-white">Diet Planner</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Generation uses your saved weight, height, goal, activity, and calorie target from Profile. Each successful
            run charges <strong className="text-neutral-300">0.005 USDC</strong> from your Circle wallet. Your latest
            plan is stored on your account and reloads when you open this page.
          </p>
        </Card.Content>
      </Card>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold">Diet Plan Generator</p>
            <Button
              className="rounded-xl bg-[#F41E1E] font-semibold text-white hover:opacity-95"
              onClick={handleGenerate}
              isDisabled={loading}
            >
              {loading ? "Building plan…" : "Build my plan"}
            </Button>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {!profileSnap?.profileComplete ? (
            <p className="text-sm text-amber-400">Complete your profile before generating.</p>
          ) : null}
          <div className="grid gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-slate-300 sm:grid-cols-2">
            <p>
              <span className="text-slate-500">Weight / height</span> — {s?.weightKg ?? "—"} kg · {s?.heightCm ?? "—"} cm
            </p>
            <p>
              <span className="text-slate-500">Goal</span> — {s?.goal ? optionLabel(GOAL_OPTIONS, s.goal) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Activity</span> — {p?.activityLevel ? optionLabel(ACTIVITY_OPTIONS, p.activityLevel) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Calorie target</span> — {p?.targetCalories ? `${p.targetCalories} kcal` : "—"}
            </p>
            <p>
              <span className="text-slate-500">Diet pattern</span> — {p?.dietType ? optionLabel(DIET_OPTIONS, p.dietType) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Fitness level</span> — {p?.fitnessLevel ? optionLabel(FITNESS_OPTIONS, p.fitnessLevel) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Meal style</span> — {p?.planStyle ? optionLabel(PLAN_STYLE_OPTIONS, p.planStyle) : "—"}
            </p>
          </div>
          <p className="text-xs text-neutral-500">Edit under Account → Profile.</p>
        </Card.Content>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-4">
            <p className="font-semibold">Macro Targets</p>
            {macroTargets.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <ProgressBar value={item.value} />
              </div>
            ))}
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-2">
            <p className="font-semibold">Daily Structure</p>
            <p className="flex items-center gap-2 rounded-lg bg-[var(--surface-soft)] p-3 text-sm">
              <Flame size={14} /> Target calories: <strong>{displayCalories} kcal</strong>
            </p>
            <p className="flex items-center gap-2 rounded-lg bg-[var(--surface-soft)] p-3 text-sm">
              <UtensilsCrossed size={14} /> Hydration target: <strong>{hydrationLiters.toFixed(1)} L</strong>
            </p>
            <p className="flex items-center gap-2 rounded-lg bg-[var(--surface-soft)] p-3 text-sm">
              <Timer size={14} /> Pre-workout nutrition window: <strong>{preWorkoutWindow}</strong>
            </p>
          </Card.Content>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => {
          const slots = parseScheduleToSlots(plan.schedule);
          return (
            <Card key={plan.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
              <Card.Content className="space-y-3">
                <p className="text-base font-semibold">{plan.title}</p>
                <p className="text-sm text-slate-300">Calories: {plan.calories} kcal</p>
                <p className="text-sm text-slate-300">Meal Frequency: {plan.meals}</p>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Meal times</p>
                  <div className="flex flex-wrap gap-2">
                    {slots.length ? (
                      slots.map((t) => (
                        <span
                          key={`${plan.title}-${t}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-sm font-medium text-white"
                        >
                          <Clock className="h-3.5 w-3.5 shrink-0 text-[#f87171]" aria-hidden />
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No times listed</span>
                    )}
                  </div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
