"use client";

import { ProgressWorkoutChartSkeleton } from "@/components/app-skeletons";
import api from "@/lib/api";
import { Card } from "@heroui/react";
import { ArrowUpRight, Scale } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { optionLabel } from "@/lib/option-label";
import { ACTIVITY_OPTIONS, FITNESS_OPTIONS, GOAL_OPTIONS } from "@/lib/profile-options";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WorkoutDayRow = {
  day: string;
  date: string;
  percent: number;
  completedBlocks: number;
  totalBlocks: number;
};

export default function ProgressPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [workoutDaily, setWorkoutDaily] = useState<WorkoutDayRow[]>([]);
  const [chartReady, setChartReady] = useState(false);
  const w = user?.stats?.weightKg ?? 0;
  const h = user?.stats?.heightCm ?? 0;
  const goal = user?.stats?.goal ?? "";
  const activity = user?.preferences?.activityLevel ?? "";
  const fitness = user?.preferences?.fitnessLevel ?? "";
  const targetCal = user?.preferences?.targetCalories ?? 0;

  const bmi = h > 0 && w > 0 ? Math.round((w / (h / 100) ** 2) * 10) / 10 : null;

  const alignment =
    goal === "fat_loss" ? 72 : goal === "muscle_gain" ? 81 : goal === "maintain" ? 88 : 75;

  const forecast =
    activity === "high"
      ? "Higher activity—watch recovery and match intake to training days."
      : activity === "low"
        ? "Lower daily activity—small calorie adjustments go further."
        : "Moderate activity—steady habits keep progress predictable.";

  useEffect(() => {
    void (async () => {
      try {
        const res = await api.get<{
          success?: boolean;
          data?: { workoutDailyTrend?: WorkoutDayRow[] };
        }>("/dashboard/summary");
        if (res.data?.success && Array.isArray(res.data.data?.workoutDailyTrend)) {
          setWorkoutDaily(res.data.data.workoutDailyTrend);
        }
      } catch {
        /* ignore */
      } finally {
        setChartReady(true);
      }
    })();
  }, []);

  return (
    <div className="space-y-5 pb-16 md:pb-0">
      <p className="panel-heading">Progress Intelligence</p>
      <h1 className="text-2xl font-semibold">Progress Tracking</h1>
      <p className="text-sm text-neutral-500">
        Values below come from your saved profile (weight, height, goal, activity). Update them under{" "}
        <strong className="text-neutral-400">Account → Profile</strong>.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-2">
            <p className="text-xs text-slate-400">Weight (profile)</p>
            <p className="flex items-center gap-2 text-xl font-semibold">
              <Scale size={16} />
              {w > 0 ? `${w} kg` : "—"}
            </p>
            <p className="text-xs text-neutral-400">
              Height {h > 0 ? `${h} cm` : "—"}
              {bmi != null ? ` · BMI ${bmi}` : ""}
            </p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-2">
            <p className="text-xs text-slate-400">Goal alignment (heuristic)</p>
            <p className="flex items-center gap-2 text-xl font-semibold">
              <ArrowUpRight size={16} />
              {goal ? `${alignment}%` : "—"}
            </p>
            <p className="text-xs text-neutral-400">
              Goal: {goal ? optionLabel(GOAL_OPTIONS, goal) : "—"} · Target {targetCal > 0 ? `${targetCal} kcal` : "—"}
            </p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-2">
            <p className="text-xs text-slate-400">Training context</p>
            <p className="text-xl font-semibold">
              {fitness ? optionLabel(FITNESS_OPTIONS, fitness) : "—"} ·{" "}
              {activity ? optionLabel(ACTIVITY_OPTIONS, activity) : "—"}
            </p>
            <p className="text-xs text-slate-300">{forecast}</p>
          </Card.Content>
        </Card>
      </div>

      {!chartReady ? (
        <ProgressWorkoutChartSkeleton />
      ) : (
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content>
            <p className="mb-1 text-sm font-semibold">Workout completion by day</p>
            <p className="mb-4 text-xs text-neutral-500">
              Rolling last 7 days (UTC). Mark sessions complete on the Workouts page after training.
            </p>
            <div className="h-64">
              {workoutDaily.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutDaily}>
                    <CartesianGrid stroke="#404040" strokeDasharray="3 3" opacity={0.35} />
                    <XAxis dataKey="day" tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(244, 30, 30, 0.12)" }}
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #404040",
                        borderRadius: "12px",
                        color: "#f5f5f5",
                      }}
                      formatter={(v) => [`${Number(v ?? 0)}%`, "Session"]}
                      labelFormatter={(_, payload) => {
                        const p = payload?.[0]?.payload as WorkoutDayRow | undefined;
                        return p?.date ?? "";
                      }}
                    />
                    <Bar dataKey="percent" radius={[8, 8, 0, 0]} fill="#F41E1E" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-neutral-500">No workout progress logged yet.</p>
              )}
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
