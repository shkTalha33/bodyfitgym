"use client";

import { Button, Card, Input } from "@heroui/react";
import { Coffee, MoonStar, Sun, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";

const baseMeals = [
  { breakfast: "Greek yogurt + berries", lunch: "Grilled chicken quinoa bowl", dinner: "Salmon, rice, broccoli" },
  { breakfast: "Protein oats + banana", lunch: "Turkey wrap + salad", dinner: "Beef stir-fry + veggies" },
  { breakfast: "Egg white omelette", lunch: "Tuna sandwich + soup", dinner: "Chicken pasta + greens" },
  { breakfast: "Cottage cheese + fruit", lunch: "Shrimp rice bowl", dinner: "Lean beef + sweet potato" },
  { breakfast: "Wholegrain toast + eggs", lunch: "Tofu poke bowl", dinner: "Chicken tikka + basmati rice" },
  { breakfast: "Smoothie + granola", lunch: "Turkey burger + salad", dinner: "Baked cod + potatoes" },
  { breakfast: "Pancakes + protein shake", lunch: "Chicken burrito bowl", dinner: "Steak + roasted vegetables" },
];

export default function MealsPage() {
  const [targetCalories, setTargetCalories] = useState("2200");
  const [mealsPerDay, setMealsPerDay] = useState("3");
  const [style, setStyle] = useState("High Protein");
  const [seed, setSeed] = useState(0);

  const weeklyMenu = useMemo(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.map((day, idx) => {
      const meal = baseMeals[(idx + seed) % baseMeals.length];
      return { day, ...meal };
    });
  }, [seed]);

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(120deg,#111b33_0%,#0d1832_40%,#15274c_100%)] p-6">
        <p className="panel-heading">Adaptive Nutrition</p>
        <h1 className="text-2xl font-semibold">Weekly Meal Planner</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Structured 7-day menu with consistent macro distribution and timing to support training goals.
        </p>
      </div>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Meal Plan Generator</p>
            <Button
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white"
              onClick={() => setSeed((prev) => prev + 1)}
            >
              Generate Meal Plan
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="mb-1 text-sm text-slate-300">Daily Calories</p>
              <Input value={targetCalories} onChange={(e) => setTargetCalories(e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Meals Per Day</p>
              <Input value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Plan Style</p>
              <Input value={style} onChange={(e) => setStyle(e.target.value)} />
            </div>
          </div>
        </Card.Content>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content>
            <p className="text-xs text-slate-400">Weekly Total</p>
            <p className="mt-1 text-xl font-semibold">{Number(targetCalories || "0") * 7} kcal</p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content>
            <p className="text-xs text-slate-400">Average Protein</p>
            <p className="mt-1 text-xl font-semibold">{Math.round(Number(targetCalories || "0") * 0.075)}g / day</p>
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content>
            <p className="text-xs text-slate-400">Meal Frequency</p>
            <p className="mt-1 flex items-center gap-2 text-xl font-semibold">
              <UtensilsCrossed size={16} className="text-violet-300" /> {mealsPerDay} meals/day ({style})
            </p>
          </Card.Content>
        </Card>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {weeklyMenu.map((menu) => (
          <Card key={menu.day} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <Card.Content className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold">{menu.day}</p>
                <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] text-violet-200">Planned</span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <p className="mb-1 flex items-center gap-1 text-xs uppercase tracking-wide text-slate-400">
                  <Coffee size={12} /> Breakfast
                </p>
                <p className="text-sm leading-snug">{menu.breakfast}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <p className="mb-1 flex items-center gap-1 text-xs uppercase tracking-wide text-slate-400">
                  <Sun size={12} /> Lunch
                </p>
                <p className="text-sm leading-snug">{menu.lunch}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <p className="mb-1 flex items-center gap-1 text-xs uppercase tracking-wide text-slate-400">
                  <MoonStar size={12} /> Dinner
                </p>
                <p className="text-sm leading-snug">{menu.dinner}</p>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
