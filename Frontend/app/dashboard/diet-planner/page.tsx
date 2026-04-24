"use client";

import { Button, Card, Input, ProgressBar } from "@heroui/react";
import { Flame, Sparkles, Timer, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";

export default function DietPlannerPage() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [goal, setGoal] = useState("fat loss");
  const [activity, setActivity] = useState("moderate");
  const [seed, setSeed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const calories = useMemo(() => {
    const base = Number(weight || "0") * 30;
    const goalFactor = goal.toLowerCase().includes("bulk") ? 1.18 : goal.toLowerCase().includes("maintain") ? 1 : 0.85;
    const activityFactor = activity.toLowerCase().includes("high") ? 1.1 : activity.toLowerCase().includes("low") ? 0.92 : 1;
    return Math.round(base * goalFactor * activityFactor);
  }, [weight, goal, activity]);

  const macroTargets = useMemo(() => {
    if (goal.toLowerCase().includes("bulk")) return [{ label: "Protein", value: 72 }, { label: "Carbs", value: 82 }, { label: "Fats", value: 54 }];
    if (goal.toLowerCase().includes("maintain")) return [{ label: "Protein", value: 74 }, { label: "Carbs", value: 72 }, { label: "Fats", value: 58 }];
    return [{ label: "Protein", value: 84 }, { label: "Carbs", value: 62 }, { label: "Fats", value: 52 }];
  }, [goal]);

  const handleGenerate = async () => {
    setLoading(true);
    setAiResponse(null);
    try {
      const response = await fetch("http://localhost:5000/api/ai/diet-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight, height, goal, activity }),
      });
      const result = await response.json();
      if (result.success) {
        setAiResponse(result.data);
      }
    } catch (error) {
      console.error("Error generating diet plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const plans = useMemo(
    () => [
      { title: "Primary Plan", calories: calories + ((seed % 3) - 1) * 40, meals: "5 meals/day", schedule: "6:30, 10:00, 13:00, 17:00, 20:00" },
      { title: "Office Day Plan", calories: calories - 120 + ((seed % 2) ? 40 : 0), meals: "4 meals/day", schedule: "8:00, 12:30, 16:30, 20:30" },
      { title: "Training Day Plan", calories: calories + 140 + ((seed % 2) ? 30 : -30), meals: "5 meals/day", schedule: "6:00, 9:30, 13:00, 17:30, 21:00" },
    ],
    [calories, seed]
  );

  return (
    <section className="space-y-4 pb-16 md:pb-4">
      <div>
        <p className="panel-heading">Macro Intelligence</p>
        <h2 className="text-2xl font-semibold">Diet Planner</h2>
        <p className="text-sm text-slate-400">Structured meal planning with macro controls and calorie targets.</p>
      </div>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Diet Plan Generator</p>
            <Button 
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white" 
              onClick={handleGenerate}
              isLoading={loading}
            >
              {loading ? "Generating..." : "Generate AI Diet Plan"}
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <p className="mb-1 text-sm text-slate-300">Weight (kg)</p>
              <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Height (cm)</p>
              <Input value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Goal</p>
              <Input value={goal} onChange={(e) => setGoal(e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Activity Level</p>
              <Input value={activity} onChange={(e) => setActivity(e.target.value)} />
            </div>
          </div>
        </Card.Content>
      </Card>

      {aiResponse && (
        <Card className="rounded-2xl border border-violet-500/30 bg-[var(--surface-soft)] p-4 shadow-xl shadow-violet-500/5">
          <Card.Content>
            <p className="mb-4 flex items-center gap-2 text-lg font-bold text-violet-400">
              <Sparkles size={20} /> AI Generated Recommendations
            </p>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {aiResponse}
            </div>
          </Card.Content>
        </Card>
      )}

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
            <p className="flex items-center gap-2 rounded-lg bg-[var(--surface-soft)] p-3 text-sm"><Flame size={14} /> Target calories: <strong>{calories} kcal</strong></p>
            <p className="flex items-center gap-2 rounded-lg bg-[var(--surface-soft)] p-3 text-sm"><UtensilsCrossed size={14} /> Hydration target: <strong>{Math.max(2.5, Number(weight || "0") * 0.04).toFixed(1)} L</strong></p>
            <p className="flex items-center gap-2 rounded-lg bg-[var(--surface-soft)] p-3 text-sm"><Timer size={14} /> Pre-workout nutrition window: <strong>90 min before training</strong></p>
          </Card.Content>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content className="space-y-2">
              <p className="text-base font-semibold">{plan.title}</p>
              <p className="text-sm text-slate-300">Calories: {plan.calories} kcal</p>
              <p className="text-sm text-slate-300">Meal Frequency: {plan.meals}</p>
              <p className="rounded-lg bg-[var(--surface-strong)] p-2 text-xs">{plan.schedule}</p>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
