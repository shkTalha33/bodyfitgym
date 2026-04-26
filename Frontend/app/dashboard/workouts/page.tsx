"use client";

import { AiModulePageSkeleton } from "@/components/app-skeletons";
import ProfilePreferencesModal from "@/components/profile-preferences-modal";
import WorkoutPlanCards, { type WorkoutPlanPayload } from "@/components/workout-plan-cards";
import api from "@/lib/api";
import { fetchProfileFresh } from "@/lib/fetch-profile";
import { normalizeUser } from "@/lib/user-normalize";
import { optionLabel } from "@/lib/option-label";
import {
  EQUIPMENT_OPTIONS,
  FITNESS_OPTIONS,
  GOAL_OPTIONS,
  MUSCLE_OPTIONS,
} from "@/lib/profile-options";
import { setAuthUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button, Card, Input, ProgressBar } from "@heroui/react";
import { Dumbbell, TimerReset } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function WorkoutsPage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const [profileSnap, setProfileSnap] = useState(authUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanPayload | null>(null);
  const [progressBusy, setProgressBusy] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
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
        const raw = u.savedPlans?.workoutPlan;
        if (raw && typeof raw === "object" && raw !== null && "sections" in raw) {
          setWorkoutPlan(raw as WorkoutPlanPayload);
        }
      } catch {
        /* not authenticated */
      } finally {
        setHydrated(true);
      }
    })();
  }, [dispatch]);

  const p = profileSnap?.preferences;
  const s = profileSnap?.stats;
  const fitnessType = p?.fitnessLevel || "beginner";
  const goalType = s?.goal ? optionLabel(GOAL_OPTIONS, s.goal) : "";
  const sessionMinutes = p?.sessionMinutes || "60";
  const days = p?.workoutFocus?.length ? p.workoutFocus : ["chest"];

  const refreshProfile = useCallback(async () => {
    const u = await fetchProfileFresh();
    dispatch(setAuthUser(u));
    setProfileSnap(u);
    return u;
  }, [dispatch]);

  const handleMarkTodayDone = async () => {
    setProgressBusy(true);
    setProgressMsg(null);
    try {
      const res = await api.post<{ success?: boolean; user?: Record<string, unknown>; message?: string }>(
        "/users/me/workout-progress",
        { markComplete: true }
      );
      if (res.data?.success && res.data.user) {
        const u = normalizeUser(res.data.user);
        if (u) {
          dispatch(setAuthUser(u));
          setProfileSnap(u);
        }
        setProgressMsg("Today marked complete.");
      } else {
        setProgressMsg(res.data?.message || "Could not update progress.");
      }
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { message?: string } } };
      setProgressMsg(ax.response?.data?.message || "Could not update progress.");
    } finally {
      setProgressBusy(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setWorkoutPlan(null);
    try {
      const me = await refreshProfile();
      if (!me.profileComplete) {
        setModalOpen(true);
        setLoading(false);
        return;
      }
      const response = await api.post("/ai/workout-plan", {});
      const result = response.data;
      if (!result.success || !result.data) {
        setError(typeof result.message === "string" ? result.message : "Could not build workout.");
        return;
      }
      setWorkoutPlan(result.data as WorkoutPlanPayload);
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

  const exercises = useMemo(() => {
    const map: Record<string, string[]> = {
      chest: ["Bench Press", "Incline Dumbbell Press", "Chest Fly"],
      back: ["Lat Pulldown", "Barbell Row", "Seated Cable Row"],
      legs: ["Squat", "Leg Press", "Romanian Deadlift"],
      shoulders: ["Overhead Press", "Lateral Raise", "Rear Delt Fly"],
      arms: ["Barbell Curl", "Triceps Pushdown", "Hammer Curl"],
      core: ["Plank", "Hanging Knee Raise", "Cable Crunch"],
    };
    return days.map((day) => ({
      day,
      exercises: map[day] || [],
    }));
  }, [days]);

  if (!hydrated) {
    return <AiModulePageSkeleton />;
  }

  return (
    <div className="space-y-5 pb-16 md:pb-0">
      <ProfilePreferencesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialUser={profileSnap}
        title="Complete your profile to generate workouts"
        onSaved={(u) => {
          setProfileSnap(u);
          dispatch(setAuthUser(u));
        }}
      />

      <p className="panel-heading">Training Intelligence</p>
      <h1 className="text-2xl font-semibold">Workout Module</h1>
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-4">
          <p className="text-xs text-neutral-500">
            Each successful generation charges <strong className="text-neutral-400">0.008 USDC</strong> from your wallet.
            Press <strong className="text-neutral-400">Enter</strong> in the field below to run the same request as the
            button.
          </p>
          <Input
            placeholder="Press Enter to generate workout plan…"
            className="w-full bg-[var(--surface-soft)]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleGenerate();
              }
            }}
            aria-label="Generate workout on Enter"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold">Workout Generator</p>
            <Button
              className="rounded-xl bg-[#F41E1E] font-semibold text-white hover:opacity-95"
              onClick={() => void handleGenerate()}
              isDisabled={loading}
            >
              {loading ? "Building…" : "Generate workout plan"}
            </Button>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {!profileSnap?.profileComplete ? (
            <p className="text-sm text-amber-400">Complete your profile before generating.</p>
          ) : null}
          <div className="grid gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-slate-300 sm:grid-cols-2">
            <p>
              <span className="text-slate-500">Goal</span> — {s?.goal ? optionLabel(GOAL_OPTIONS, s.goal) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Fitness level</span> — {p?.fitnessLevel ? optionLabel(FITNESS_OPTIONS, p.fitnessLevel) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Equipment</span> — {p?.equipment ? optionLabel(EQUIPMENT_OPTIONS, p.equipment) : "—"}
            </p>
            <p>
              <span className="text-slate-500">Session length</span> — {p?.sessionMinutes ? `${p.sessionMinutes} min` : "—"}
            </p>
            <p className="sm:col-span-2">
              <span className="text-slate-500">Focus areas</span> —{" "}
              {days.length
                ? days.map((d) => MUSCLE_OPTIONS.find((m) => m.value === d)?.label ?? d).join(", ")
                : "—"}
            </p>
          </div>
          <p className="text-xs text-neutral-500">Edit under Account menu → Profile.</p>
        </Card.Content>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-3">
            <p className="flex items-center gap-2 font-semibold">
              <Dumbbell size={16} /> Today&apos;s Readiness
            </p>
            <ProgressBar
              value={fitnessType === "advanced" ? 88 : fitnessType === "intermediate" ? 80 : 72}
            />
            <p className="text-xs text-slate-400">
              Score tuned for {optionLabel(FITNESS_OPTIONS, fitnessType)}, {goalType}, {sessionMinutes}-minute sessions.
            </p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-3">
            <p className="flex items-center gap-2 font-semibold">
              <TimerReset size={16} /> Recovery Timer
            </p>
            <p className="rounded-xl bg-[var(--surface-soft)] p-3 text-sm text-neutral-300">
              {fitnessType === "advanced"
                ? "Recovery: allow roughly 36–48h before repeating the same primary lift emphasis."
                : fitnessType === "intermediate"
                  ? "Recovery: allow about 48h before training the same muscle group heavy again."
                  : "Recovery: allow 48–72h between demanding full-body sessions while you build capacity."}
            </p>
          </Card.Content>
        </Card>
      </div>

      {workoutPlan ? (
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 md:p-6">
          <Card.Content className="space-y-3 p-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-400">Your last saved session (reloads when you open this page).</p>
              <Button
                variant="secondary"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] font-semibold text-white"
                onClick={() => void handleMarkTodayDone()}
                isDisabled={progressBusy}
              >
                {progressBusy ? "Saving…" : "Mark today’s session complete"}
              </Button>
            </div>
            {progressMsg ? <p className="text-xs text-neutral-400">{progressMsg}</p> : null}
            <WorkoutPlanCards plan={workoutPlan} />
          </Card.Content>
        </Card>
      ) : null}

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-3">
          <p className="text-sm font-semibold text-neutral-300">Exercise ideas by your saved focus</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {exercises.map((block) => (
              <div key={block.day} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <p className="text-xs font-semibold uppercase text-[#f87171]">{block.day}</p>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-400">
                  {block.exercises.map((ex) => (
                    <li key={ex}>{ex}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
