"use client";

import { Button, Card, Input, ProgressBar } from "@heroui/react";
import { Dumbbell, Sparkles, TimerReset } from "lucide-react";
import { useMemo, useState } from "react";

export default function WorkoutsPage() {
  const [fitnessType, setFitnessType] = useState("beginner");
  const [goalType, setGoalType] = useState("fat loss");
  const [days, setDays] = useState<string[]>(["chest"]);
  const [equipment, setEquipment] = useState("dumbbells");
  const [sessionMinutes, setSessionMinutes] = useState("60");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const dayOptions = ["chest", "back", "legs", "shoulders", "arms", "core"];

  const toggleDay = (day: string) => {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setAiResponse(null);
    try {
      const response = await fetch("http://localhost:5000/api/ai/workout-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fitnessType, goalType, equipment, sessionMinutes, days }),
      });
      const result = await response.json();
      if (result.success) {
        setAiResponse(result.data);
      }
    } catch (error) {
      console.error("Error generating workout plan:", error);
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

  return (
    <div className="space-y-5 pb-16 md:pb-0">
      <p className="panel-heading">Training Intelligence</p>
      <h1 className="text-2xl font-semibold">Workout Module</h1>
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Workout Generator</p>
            <Button 
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white" 
              onClick={handleGenerate}
              isLoading={loading}
            >
              {loading ? "Generating..." : "Generate AI Workout Plan"}
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { label: "Fitness Type", value: fitnessType, setValue: setFitnessType },
              { label: "Goal Type", value: goalType, setValue: setGoalType },
              { label: "Equipment", value: equipment, setValue: setEquipment },
              { label: "Session Minutes", value: sessionMinutes, setValue: setSessionMinutes },
            ].map((field) => (
              <div key={field.label}>
                <p className="mb-1 text-sm text-slate-300">{field.label}</p>
                <Input value={field.value} onChange={(e) => field.setValue(e.target.value)} />
              </div>
            ))}
          </div>
          <div>
            <p className="mb-2 text-sm text-slate-300">Workout Days / Muscle Groups (multi-select)</p>
            <div className="flex flex-wrap gap-2">
              {dayOptions.map((day) => (
                <Button
                  key={day}
                  onClick={() => toggleDay(day)}
                  size="sm"
                  className={`rounded-full ${days.includes(day) ? "bg-violet-600 text-white" : "bg-[var(--surface-soft)] text-slate-300"}`}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-3">
            <p className="flex items-center gap-2 font-semibold"><Dumbbell size={16} /> Today&apos;s Readiness</p>
            <ProgressBar value={fitnessType.toLowerCase().includes("advanced") ? 88 : fitnessType.toLowerCase().includes("intermediate") ? 80 : 72} />
            <p className="text-xs text-slate-400">AI score tuned for {fitnessType}, {goalType}, {sessionMinutes}-minute sessions.</p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-3">
            <p className="flex items-center gap-2 font-semibold"><TimerReset size={16} /> Recovery Timer</p>
            <p className="rounded-xl bg-[var(--surface-soft)] p-3 text-sm">Next high-intensity session recommended in <strong>16h 20m</strong>.</p>
          </Card.Content>
        </Card>
      {aiResponse && (
        <Card className="rounded-2xl border border-violet-500/30 bg-[var(--surface-soft)] p-4 shadow-xl shadow-violet-500/5">
          <Card.Content>
            <p className="mb-4 flex items-center gap-2 text-lg font-bold text-violet-400">
              <Sparkles size={20} /> AI Generated Strategy
            </p>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {aiResponse}
            </div>
          </Card.Content>
        </Card>
      )}
      </div>
    </div>
  );
}
