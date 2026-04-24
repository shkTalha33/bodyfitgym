import { Card } from "@heroui/react";
import { ArrowUpRight, Scale } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="space-y-5 pb-16 md:pb-0">
      <p className="panel-heading">Progress Intelligence</p>
      <h1 className="text-2xl font-semibold">Progress Tracking</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-2">
            <p className="text-xs text-slate-400">Weight Trend</p>
            <p className="flex items-center gap-2 text-xl font-semibold"><Scale size={16} /> 70.0kg</p>
            <p className="text-xs text-emerald-400">-1.2kg this month</p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-2">
            <p className="text-xs text-slate-400">Goal Alignment</p>
            <p className="flex items-center gap-2 text-xl font-semibold"><ArrowUpRight size={16} /> 84%</p>
            <p className="text-xs text-violet-300">Consistency above target</p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-2">
            <p className="text-xs text-slate-400">Adaptive Forecast</p>
            <p className="text-xl font-semibold">On track</p>
            <p className="text-xs text-slate-300">Expected milestone in 11 days at current adherence.</p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
