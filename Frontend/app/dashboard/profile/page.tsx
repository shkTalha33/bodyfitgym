"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button, Card, Input } from "@heroui/react";
import { Ruler, Target, UserRound, Weight } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  age: z.number().min(12).max(90),
  heightCm: z.number().min(100).max(250),
  weightKg: z.number().min(30).max(250),
  goal: z.string().min(2),
  dietType: z.string().min(2),
  fitnessLevel: z.string().min(2),
  schedule: z.string().min(2),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSetupPage() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      age: 25,
      heightCm: 175,
      weightKg: 70,
      goal: "Fat loss",
      dietType: "High protein",
      fitnessLevel: "Intermediate",
      schedule: "Mon, Wed, Fri",
    },
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaved(true);
  };

  return (
    <section className="space-y-5 pb-20 md:pb-4">
      <div>
        <h2 className="text-2xl font-semibold">Profile Setup</h2>
        <p className="text-sm text-slate-400">Set body metrics and training preferences for precision coaching.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Current Weight", value: "70 kg", icon: Weight },
          { label: "Height", value: "175 cm", icon: Ruler },
          { label: "Goal", value: "Fat Loss", icon: Target },
          { label: "Level", value: "Intermediate", icon: UserRound },
        ].map((item) => (
          <Card key={item.label} className="surface-soft rounded-2xl bg-[var(--surface-soft)]">
            <Card.Content className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-base font-semibold">{item.value}</p>
              </div>
              <item.icon size={18} className="text-violet-300" />
            </Card.Content>
          </Card>
        ))}
      </div>
      <Card className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                { name: "fullName", label: "Full name", type: "text" },
                { name: "age", label: "Age", type: "number" },
                { name: "heightCm", label: "Height (cm)", type: "number" },
                { name: "weightKg", label: "Weight (kg)", type: "number" },
                { name: "goal", label: "Primary goal", type: "text" },
                { name: "dietType", label: "Diet type", type: "text" },
                { name: "fitnessLevel", label: "Fitness level", type: "text" },
                { name: "schedule", label: "Workout schedule", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <p className="mb-1 text-sm font-medium text-slate-200">{field.label}</p>
                  <Input
                    type={field.type}
                    className="bg-[var(--surface-soft)]"
                    {...register(
                      field.name as keyof ProfileForm,
                      field.type === "number" ? { valueAsNumber: true } : {}
                    )}
                  />
                  {errors[field.name as keyof ProfileForm] && (
                    <p className="mt-1 text-xs text-red-500">{errors[field.name as keyof ProfileForm]?.message as string}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button type="submit" isDisabled={isSubmitting} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white">
                {isSubmitting ? "Saving..." : "Save profile"}
              </Button>
              {saved && <p className="text-sm text-emerald-400">Profile settings saved successfully.</p>}
            </div>
          </form>
        </Card.Content>
      </Card>
    </section>
  );
}
