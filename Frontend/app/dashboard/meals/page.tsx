"use client";

import ProfilePreferencesModal from "@/components/profile-preferences-modal";
import api from "@/lib/api";
import { fetchProfileFresh } from "@/lib/fetch-profile";
import { optionLabel } from "@/lib/option-label";
import {
  ACTIVITY_OPTIONS,
  DIET_OPTIONS,
  EQUIPMENT_OPTIONS,
  FITNESS_OPTIONS,
  GOAL_OPTIONS,
  PLAN_STYLE_OPTIONS,
} from "@/lib/profile-options";
import { setAuthUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button, Card } from "@heroui/react";
import { UtensilsCrossed } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type MealSlot = { food: string; calories: number; proteinG: number; carbsG: number; fatG: number };

type DayRow = {
  day: string;
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
  dailyTotals: { calories: number; proteinG: number; carbsG: number; fatG: number };
};

function MealMacros({ meal }: { meal: MealSlot }) {
  return (
    <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500 sm:text-xs">
      <span className="font-medium text-neutral-400">{meal.calories} kcal</span>
      <span className="mx-1 text-neutral-600">·</span>
      <span>P {meal.proteinG}g</span>
      <span className="mx-1 text-neutral-600">·</span>
      <span>C {meal.carbsG}g</span>
      <span className="mx-1 text-neutral-600">·</span>
      <span>F {meal.fatG}g</span>
    </p>
  );
}

export default function MealsPage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weeklyDays, setWeeklyDays] = useState<DayRow[] | null>(null);
  const [profileSnap, setProfileSnap] = useState(authUser);

  useEffect(() => {
    if (authUser) setProfileSnap(authUser);
  }, [authUser]);

  const refreshProfile = useCallback(async () => {
    const u = await fetchProfileFresh();
    dispatch(setAuthUser(u));
    setProfileSnap(u);
    return u;
  }, [dispatch]);

  const weekStats = (() => {
    if (!weeklyDays?.length) return null;
    let cal = 0;
    let p = 0;
    let c = 0;
    let f = 0;
    for (const d of weeklyDays) {
      cal += d.dailyTotals.calories;
      p += d.dailyTotals.proteinG;
      c += d.dailyTotals.carbsG;
      f += d.dailyTotals.fatG;
    }
    const n = weeklyDays.length;
    return {
      weekCalories: cal,
      avgDailyCal: Math.round(cal / n),
      avgProtein: Math.round(p / n),
      avgCarbs: Math.round(c / n),
      avgFat: Math.round(f / n),
    };
  })();

  const p = profileSnap?.preferences;
  const s = profileSnap?.stats;
  const targetN = p?.targetCalories ?? 0;

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
      const response = await api.post("/ai/weekly-meals", {});
      const result = response.data;
      if (!result.success || !result.data?.days) {
        setError(typeof result.message === "string" ? result.message : "Could not build the weekly plan.");
        return;
      }
      setWeeklyDays(result.data.days as DayRow[]);
    } catch (e: unknown) {
      const ax = e as { response?: { status?: number; data?: { code?: string; message?: string } } };
      if (ax.response?.status === 403 && ax.response.data?.code === "PROFILE_INCOMPLETE") {
        setModalOpen(true);
      } else {
        setError(ax.response?.data?.message || "Request failed. Is the server running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <ProfilePreferencesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialUser={profileSnap}
        title="Complete your profile to generate meals"
        onSaved={(u) => {
          setProfileSnap(u);
          dispatch(setAuthUser(u));
        }}
      />

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="p-6">
          <p className="panel-heading">Adaptive Nutrition</p>
          <h1 className="text-2xl font-semibold text-white">Weekly Meal Planner</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            Plans use your saved calorie target, meal frequency, and diet style from Profile—no manual typing here.
          </p>
        </Card.Content>
      </Card>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold">Your saved nutrition targets</p>
            <Button
              className="rounded-xl bg-[#F41E1E] font-semibold text-white hover:opacity-95"
              onClick={handleGenerate}
              isDisabled={loading}
            >
              {loading ? "Building week…" : "Build weekly plan"}
            </Button>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {!profileSnap?.profileComplete ? (
            <p className="text-sm text-amber-400">
              Profile incomplete — we&apos;ll prompt you to finish saved preferences before the first generation.
            </p>
          ) : null}
          <div className="grid gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-slate-300 sm:grid-cols-2">
            <p>
              <span className="text-slate-500">Goal</span> — {s?.goal ? optionLabel(GOAL_OPTIONS, s.goal) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Daily calories</span> — {p?.targetCalories ? `${p.targetCalories} kcal` : "—"}
            </p>
            <p>
              <span className="text-slate-500">Meals / day</span> — {p?.mealsPerDay ?? "—"}
            </p>
            <p>
              <span className="text-slate-500">Style</span> — {p?.planStyle ? optionLabel(PLAN_STYLE_OPTIONS, p.planStyle) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Diet pattern</span> — {p?.dietType ? optionLabel(DIET_OPTIONS, p.dietType) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Activity</span> — {p?.activityLevel ? optionLabel(ACTIVITY_OPTIONS, p.activityLevel) : "—"}
            </p>
          </div>
          <p className="text-xs text-neutral-500">
            Change these anytime under <strong className="text-neutral-400">Dashboard → Profile</strong>.
          </p>
        </Card.Content>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content>
            <p className="text-xs text-slate-400">{weekStats ? "Week calories (sum)" : "Weekly total (saved target)"}</p>
            <p className="mt-1 text-xl font-semibold">{weekStats ? weekStats.weekCalories : targetN * 7} kcal</p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content>
            <p className="text-xs text-slate-400">{weekStats ? "Avg daily calories" : "Daily target"}</p>
            <p className="mt-1 text-xl font-semibold">{weekStats ? weekStats.avgDailyCal : targetN || "—"}</p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content>
            <p className="text-xs text-slate-400">{weekStats ? "Avg protein / day" : "Protein (est.)"}</p>
            <p className="mt-1 text-xl font-semibold">{weekStats ? weekStats.avgProtein : targetN ? Math.round(targetN * 0.075) : "—"}g</p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content>
            <p className="text-xs text-slate-400">{weekStats ? "Avg carbs / fat" : "Training (saved)"}</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-white">
              {weekStats ? (
                <>
                  C {weekStats.avgCarbs}g · F {weekStats.avgFat}g
                </>
              ) : (
                <span className="flex items-center gap-2 text-xl">
                  <UtensilsCrossed size={16} className="text-[#f87171]" />
                  {p?.fitnessLevel ? optionLabel(FITNESS_OPTIONS, p.fitnessLevel) : "—"} ·{" "}
                  {p?.equipment ? optionLabel(EQUIPMENT_OPTIONS, p.equipment) : ""}
                </span>
              )}
            </p>
          </Card.Content>
        </Card>
      </section>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="p-0 sm:p-0">
          <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
            <p className="text-sm font-semibold text-white">7-day menu</p>
            <p className="text-xs text-neutral-500">Per-meal macros and day totals from your saved targets.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-soft)] text-xs uppercase tracking-wide text-slate-400">
                  <th className="whitespace-nowrap px-3 py-3 font-semibold sm:px-4">Day</th>
                  <th className="px-3 py-3 font-semibold sm:px-4">Breakfast</th>
                  <th className="px-3 py-3 font-semibold sm:px-4">Lunch</th>
                  <th className="px-3 py-3 font-semibold sm:px-4">Dinner</th>
                  <th className="whitespace-nowrap px-3 py-3 font-semibold sm:px-4">Day total</th>
                </tr>
              </thead>
              <tbody>
                {weeklyDays?.length ? (
                  weeklyDays.map((row) => (
                    <tr key={row.day} className="border-b border-[var(--border)] last:border-0 align-top">
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-white sm:px-4">{row.day}</td>
                      <td className="max-w-[200px] px-3 py-3 text-slate-200 sm:max-w-[240px] sm:px-4">
                        <p className="leading-snug">{row.breakfast.food}</p>
                        <MealMacros meal={row.breakfast} />
                      </td>
                      <td className="max-w-[200px] px-3 py-3 text-slate-200 sm:max-w-[240px] sm:px-4">
                        <p className="leading-snug">{row.lunch.food}</p>
                        <MealMacros meal={row.lunch} />
                      </td>
                      <td className="max-w-[200px] px-3 py-3 text-slate-200 sm:max-w-[240px] sm:px-4">
                        <p className="leading-snug">{row.dinner.food}</p>
                        <MealMacros meal={row.dinner} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-300 sm:px-4">
                        <p className="font-medium text-white">{row.dailyTotals.calories} kcal</p>
                        <p className="mt-1 text-[11px] text-neutral-500 sm:text-xs">
                          P {row.dailyTotals.proteinG}g · C {row.dailyTotals.carbsG}g · F {row.dailyTotals.fatG}g
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500 sm:px-6">
                      Run <strong className="text-neutral-400">Build weekly plan</strong> after your profile is complete.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
