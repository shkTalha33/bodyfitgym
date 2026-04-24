"use client";

import { Card } from "@heroui/react";
import { Activity, Dumbbell, Flame, Lightbulb, Timer, Zap } from "lucide-react";

export type WorkoutExercise = {
  name: string;
  sets: string | number;
  reps: string;
  rest?: string;
  tip?: string;
};

export type WorkoutSection = {
  title: string;
  exercises: WorkoutExercise[];
};

export type WorkoutPlanPayload = {
  title: string;
  overview?: string;
  sections: WorkoutSection[];
};

const FALLBACK_TIP =
  "Control the lowering phase, keep joints stacked, and breathe steadily—stop the set before form falls apart.";

function SectionIcon({ title }: { title: string }) {
  const t = title.toLowerCase();
  if (t.includes("warm")) return <Flame className="h-4 w-4 text-orange-400" aria-hidden />;
  if (t.includes("cool") || t.includes("stretch")) return <Activity className="h-4 w-4 text-sky-400" aria-hidden />;
  if (t.includes("cardio") || t.includes("condition")) return <Zap className="h-4 w-4 text-amber-400" aria-hidden />;
  return <Dumbbell className="h-4 w-4 text-[#f87171]" aria-hidden />;
}

export default function WorkoutPlanCards({ plan }: { plan: WorkoutPlanPayload }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-xl font-semibold text-white">{plan.title}</h2>
        {plan.overview ? <p className="mt-2 text-sm text-neutral-400">{plan.overview}</p> : null}
      </div>

      {plan.sections.map((section, si) => (
        <div key={`${section.title}-${si}`} className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">
            <SectionIcon title={section.title} />
            {section.title}
          </h3>
          {/* 1 col phone → 2 cols tablet → 3+ cols desktop (at least 3 per row on large screens) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.exercises.map((ex, i) => {
              const tipText = (ex.tip && ex.tip.trim()) || FALLBACK_TIP;
              return (
                <Card
                  key={`${section.title}-${ex.name}-${i}`}
                  className="flex h-full min-h-0 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]"
                >
                  <Card.Content className="flex flex-1 flex-col gap-3 p-4">
                    <p className="font-semibold leading-snug text-white">{ex.name}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-lg bg-[var(--surface-strong)] px-2 py-1 text-neutral-200">
                        Sets: <strong className="text-white">{ex.sets}</strong>
                      </span>
                      <span className="rounded-lg bg-[var(--surface-strong)] px-2 py-1 text-neutral-200">
                        Reps: <strong className="text-white">{ex.reps}</strong>
                      </span>
                      {ex.rest ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--surface-strong)] px-2 py-1 text-neutral-200">
                          <Timer className="h-3 w-3 text-[#f87171]" aria-hidden />
                          <strong className="text-white">{ex.rest}</strong>
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-auto border-t border-[var(--border)] pt-3">
                      <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#f87171]">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                        Form tip
                      </p>
                      <p className="line-clamp-3 text-xs leading-relaxed text-neutral-400">{tipText}</p>
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
