"use client";

import { Card } from "@heroui/react";
import { Activity, Droplets, Flame, Footprints, Sparkles, Target, Timer } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const trendData = [
  { day: "Mon", calories: 1860, steps: 7300 },
  { day: "Tue", calories: 2020, steps: 8400 },
  { day: "Wed", calories: 1950, steps: 7900 },
  { day: "Thu", calories: 2110, steps: 9200 },
  { day: "Fri", calories: 2050, steps: 9800 },
  { day: "Sat", calories: 2280, steps: 10300 },
  { day: "Sun", calories: 1980, steps: 8700 },
];

const workoutSplit = [
  { name: "Strength", value: 46, color: "#F41E1E" },
  { name: "Cardio", value: 32, color: "#a3a3a3" },
  { name: "Mobility", value: 22, color: "#525252" },
];

const iconStats = [
  { icon: Flame, label: "Calorie Burn", value: "2,140", delta: "+4.2%" },
  { icon: Activity, label: "Training Load", value: "82%", delta: "+7.1%" },
  { icon: Footprints, label: "Daily Steps", value: "9,820", delta: "+5.8%" },
  { icon: Droplets, label: "Hydration", value: "2.7L", delta: "+2.1%" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(125deg,#1a1a1a_0%,#141414_45%,#1f1515_100%)] p-6">
        <p className="panel-heading">Body Fit</p>
        <h1 className="text-2xl font-bold italic tracking-tight text-white">Your training command center</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Your AI agent monitors training, nutrition, and recovery signals in real time and recommends exact next actions.
        </p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {iconStats.map((item) => (
          <Card key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content className="flex items-center justify-between">
              <div className="rounded-xl bg-[var(--accent-soft)] p-2.5 text-[#F41E1E]">
                <item.icon size={18} />
              </div>
              <div className="text-right leading-tight">
                <p className="text-xs text-neutral-500">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
                <p className="text-xs text-emerald-400">{item.delta}</p>
              </div>
            </Card.Content>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] lg:col-span-2">
          <Card.Content>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold">Weekly Calorie Signal</p>
              <p className="text-xs text-neutral-500">7-day trend</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <defs>
                    <linearGradient id="caloriesBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F41E1E" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#991b1b" stopOpacity={0.45} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#404040" strokeDasharray="3 3" opacity={0.35} />
                  <XAxis dataKey="day" tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(244, 30, 30, 0.12)" }}
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #404040",
                      borderRadius: "12px",
                      color: "#f5f5f5",
                    }}
                    labelStyle={{ color: "#d4d4d4", fontWeight: 600 }}
                    itemStyle={{ color: "#f5f5f5" }}
                  />
                  <Bar dataKey="calories" radius={[10, 10, 0, 0]} fill="url(#caloriesBar)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content className="space-y-3">
            <p className="text-sm font-semibold">AI Recommendations</p>
            {[
              { icon: Sparkles, title: "Macro Shift", body: "Add 20g protein at dinner to improve recovery." },
              { icon: Target, title: "Goal Accuracy", body: "You are 84% aligned with weekly fat-loss target." },
              { icon: Timer, title: "Recovery Window", body: "Best next high-intensity session in 16h." },
            ].map((rec) => (
              <div key={rec.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <p className="mb-1 flex items-center gap-2 text-sm font-medium">
                  <rec.icon size={14} className="text-[#f87171]" />
                  {rec.title}
                </p>
                <p className="text-xs text-neutral-400">{rec.body}</p>
              </div>
            ))}
          </Card.Content>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content>
            <p className="mb-4 text-sm font-semibold">Steps Trajectory</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <defs>
                    <linearGradient id="stepsGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#F41E1E" />
                      <stop offset="100%" stopColor="#fca5a5" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#404040" strokeDasharray="3 3" opacity={0.35} />
                  <XAxis dataKey="day" tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ stroke: "#525252", strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #404040",
                      borderRadius: "12px",
                      color: "#f5f5f5",
                    }}
                    labelStyle={{ color: "#d4d4d4", fontWeight: 600 }}
                    itemStyle={{ color: "#f5f5f5" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="steps"
                    stroke="url(#stepsGlow)"
                    strokeWidth={3.5}
                    dot={{ r: 4, strokeWidth: 0, fill: "#F41E1E" }}
                    activeDot={{ r: 6, fill: "#fca5a5" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>

        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content>
            <p className="mb-4 text-sm font-semibold">Workout Composition</p>
            <div className="h-72">
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
            </div>
          </Card.Content>
        </Card>
      </section>
    </div>
  );
}
