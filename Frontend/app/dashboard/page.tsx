"use client";

import { DashboardPageSkeleton } from "@/components/app-skeletons";
import api from "@/lib/api";
import { Card } from "@heroui/react";
import Link from "next/link";
import { Activity, Droplets, Flame, Footprints, Sparkles, Target, Timer, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SpendingRow = { day: string; date: string; usdc: number };
type SplitRow = { name: string; value: number; color: string };
type RecRow = { title: string; body: string };

type WorkoutDayRow = {
  day: string;
  date: string;
  percent: number;
  completedBlocks: number;
  totalBlocks: number;
};

type SavedPlansSummary = {
  hasDietPlan: boolean;
  hasWeeklyMeals: boolean;
  hasWorkoutPlan: boolean;
  dietPlanSavedAt: string | null;
  weeklyMealsSavedAt: string | null;
  workoutPlanSavedAt: string | null;
};

type DashboardPayload = {
  spendingTrend: SpendingRow[];
  workoutDailyTrend?: WorkoutDayRow[];
  savedPlansSummary?: SavedPlansSummary;
  workoutSplit: SplitRow[];
  wallet?: {
    currentBalanceUsdc: string;
    totalSpentUsdc: string;
    txCount7d: number;
  } | null;
  iconStats: {
    calorieTarget: number;
    trainingLoad: number;
    stepsEstimate: number;
    hydrationLiters: number;
  };
  aiRecommendations: RecRow[];
  profileEcho?: {
    goal: string;
    fitness: string;
    activity: string;
    weightKg: number;
    heightCm: number;
    bmi: number | null;
  };
};

const recIcons = [Sparkles, Target, Timer];

export default function DashboardHome() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    await Promise.resolve();
    setLoadErr(null);
    try {
      const res = await api.get<{ success: boolean; data: DashboardPayload }>("/dashboard/summary");
      if (res.data.success && res.data.data) setData(res.data.data);
      else setLoadErr("Could not load dashboard.");
    } catch {
      setLoadErr("Could not load dashboard.");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const spendingData = data?.spendingTrend ?? [];
  const workoutSplit = data?.workoutSplit ?? [];
  const iconStats = data?.iconStats;
  const recs = data?.aiRecommendations ?? [];
  const workoutDays = data?.workoutDailyTrend ?? [];
  const savedSum = data?.savedPlansSummary;
  const wallet = data?.wallet;

  const formatSavedAt = (iso: string | null | undefined) => {
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleString();
  };

  const statCards = iconStats
    ? [
        {
          icon: Flame,
          label: "Daily calorie target",
          value: `${iconStats.calorieTarget.toLocaleString()} kcal`,
          delta: "From your profile",
        },
        {
          icon: Activity,
          label: "Training load (est.)",
          value: `${iconStats.trainingLoad}%`,
          delta: `Based on ${data?.profileEcho?.fitness ?? "—"} level`,
        },
        {
          icon: Footprints,
          label: "Steps (activity-based est.)",
          value: iconStats.stepsEstimate.toLocaleString(),
          delta: `From ${data?.profileEcho?.activity ?? "—"} activity`,
        },
        {
          icon: Droplets,
          label: "Hydration (est.)",
          value: `${iconStats.hydrationLiters} L`,
          delta: `From weight ${data?.profileEcho?.weightKg ?? "—"} kg`,
        },
      ]
    : [];

  if (!data && !loadErr) {
    return <DashboardPageSkeleton />;
  }

  if (!data && loadErr) {
    return (
      <div className="space-y-6 pb-16 md:pb-0">
        <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(125deg,#1a1a1a_0%,#141414_45%,#1f1515_100%)] p-6">
          <p className="panel-heading">Body Fit</p>
          <h1 className="text-2xl font-bold italic tracking-tight text-white">Your training command center</h1>
        </div>
        <p className="text-sm text-amber-400">{loadErr}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(125deg,#1a1a1a_0%,#141414_45%,#1f1515_100%)] p-6">
        <p className="panel-heading">Body Fit</p>
        <h1 className="text-2xl font-bold italic tracking-tight text-white">Your training command center</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Spending shows confirmed USDC debits to the app (last 7 days, UTC). Workout completion updates when you mark
          sessions done. Balance snapshot below is from the same feed as Wallet.
        </p>
        {wallet ? (
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3">
              <p className="flex items-center gap-2 text-xs text-neutral-500">
                <Wallet size={14} className="text-[#f87171]" />
                Balance (USDC)
              </p>
              <p className="mt-1 font-semibold text-white">{Number(wallet.currentBalanceUsdc).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3">
              <p className="text-xs text-neutral-500">Total sent to app (confirmed)</p>
              <p className="mt-1 font-semibold text-white">{Number(wallet.totalSpentUsdc).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3">
              <p className="text-xs text-neutral-500">Tx in last 7 days</p>
              <p className="mt-1 font-semibold text-white">{wallet.txCount7d}</p>
            </div>
            <Link
              href="/dashboard/wallet"
              className="self-center text-xs font-semibold text-[#f87171] hover:underline"
            >
              Open wallet →
            </Link>
          </div>
        ) : null}
      </div>

      {loadErr ? <p className="text-sm text-amber-400">{loadErr}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <Card key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content className="flex items-center justify-between">
              <div className="rounded-xl bg-[var(--accent-soft)] p-2.5 text-[#F41E1E]">
                <item.icon size={18} />
              </div>
              <div className="text-right leading-tight">
                <p className="text-xs text-neutral-500">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
                <p className="text-xs text-neutral-400">{item.delta}</p>
              </div>
            </Card.Content>
          </Card>
        ))}
      </section>

      {savedSum ? (
        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Diet planner</p>
              <p className="text-sm text-neutral-300">
                {savedSum.hasDietPlan ? "Saved plan on your account." : "No saved plan yet."}
              </p>
              {savedSum.hasDietPlan ? (
                <p className="text-xs text-neutral-500">{formatSavedAt(savedSum.dietPlanSavedAt) ?? "—"}</p>
              ) : null}
              <Link
                href="/dashboard/diet-planner"
                className="text-xs font-semibold text-[#f87171] hover:underline"
              >
                Open diet planner →
              </Link>
            </Card.Content>
          </Card>
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Weekly meals</p>
              <p className="text-sm text-neutral-300">
                {savedSum.hasWeeklyMeals ? "Saved 7-day grid on your account." : "No saved week yet."}
              </p>
              {savedSum.hasWeeklyMeals ? (
                <p className="text-xs text-neutral-500">{formatSavedAt(savedSum.weeklyMealsSavedAt) ?? "—"}</p>
              ) : null}
              <Link href="/dashboard/meals" className="text-xs font-semibold text-[#f87171] hover:underline">
                Open meals →
              </Link>
            </Card.Content>
          </Card>
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Workout</p>
              <p className="text-sm text-neutral-300">
                {savedSum.hasWorkoutPlan ? "Saved session on your account." : "No saved workout yet."}
              </p>
              {savedSum.hasWorkoutPlan ? (
                <p className="text-xs text-neutral-500">{formatSavedAt(savedSum.workoutPlanSavedAt) ?? "—"}</p>
              ) : null}
              <Link href="/dashboard/workouts" className="text-xs font-semibold text-[#f87171] hover:underline">
                Open workouts →
              </Link>
            </Card.Content>
          </Card>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] lg:col-span-2">
          <Card.Content>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold">USDC spending (last 7 days)</p>
              <p className="text-xs text-neutral-500">Confirmed transfers to the app merchant address · UTC days</p>
            </div>
            <div className="h-72">
              {spendingData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendingData}>
                    <defs>
                      <linearGradient id="spendBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F41E1E" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.5} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#404040" strokeDasharray="3 3" opacity={0.35} />
                    <XAxis dataKey="day" tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: "#a3a3a3", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => (Number(v) >= 1 ? v.toFixed(2) : String(v))}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(244, 30, 30, 0.12)" }}
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #404040",
                        borderRadius: "12px",
                        color: "#f5f5f5",
                      }}
                      labelStyle={{ color: "#d4d4d4", fontWeight: 600 }}
                      formatter={(v) => [`${Number(v).toFixed(6)} USDC`, "Spent"]}
                      labelFormatter={(_, payload) => {
                        const p = payload?.[0]?.payload as SpendingRow | undefined;
                        return p?.date ?? "";
                      }}
                    />
                    <Bar dataKey="usdc" radius={[10, 10, 0, 0]} fill="url(#spendBar)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                  No spending data yet. Fund your wallet and use AI features.
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content className="space-y-3">
            <p className="text-sm font-semibold">Recommendations</p>
            {recs.length ? (
              recs.map((rec, i) => {
                const Ico = recIcons[i % recIcons.length];
                return (
                  <div key={rec.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                    <p className="mb-1 flex items-center gap-2 text-sm font-medium">
                      <Ico size={14} className="text-[#f87171]" />
                      {rec.title}
                    </p>
                    <p className="text-xs text-neutral-400">{rec.body}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-neutral-500">Complete your profile for tailored tips.</p>
            )}
          </Card.Content>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content>
            <p className="mb-4 text-sm font-semibold">Workout completion (last 7 days)</p>
            <div className="h-72">
              {workoutDays.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutDays}>
                    <CartesianGrid stroke="#404040" strokeDasharray="3 3" opacity={0.35} />
                    <XAxis dataKey="day" tick={{ fill: "#a3a3a3", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#a3a3a3", fontSize: 11 }} axisLine={false} tickLine={false} />
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
                    <Bar dataKey="percent" name="Done %" radius={[8, 8, 0, 0]} fill="#F41E1E" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-500">No data.</div>
              )}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Mark a session complete on the Workouts page after you finish. Generating a new workout resets today&apos;s
              blocks.
            </p>
          </Card.Content>
        </Card>

        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content>
            <p className="mb-4 text-sm font-semibold">Workout focus split (from profile)</p>
            <div className="h-72">
              {workoutSplit.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workoutSplit}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={68}
                      outerRadius={104}
                      paddingAngle={3}
                      stroke="#121212"
                      strokeWidth={2}
                    >
                      {workoutSplit.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #404040",
                        borderRadius: "12px",
                        color: "#f5f5f5",
                      }}
                      labelStyle={{ color: "#d4d4d4", fontWeight: 600 }}
                      itemStyle={{ color: "#f5f5f5" }}
                    />
                    <Legend wrapperStyle={{ color: "#a3a3a3", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-500">No focus areas saved.</div>
              )}
            </div>
          </Card.Content>
        </Card>
      </section>
    </div>
  );
}
