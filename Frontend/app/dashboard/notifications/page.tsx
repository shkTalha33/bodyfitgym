"use client";

import { useState } from "react";
import { Button, Card, Switch } from "@heroui/react";
import { BellRing, CalendarClock, Trophy, Waves } from "lucide-react";

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const initialSettings: NotificationSetting[] = [
  { id: "hydration", title: "Hydration reminders", description: "Remind every 2 hours to drink water.", enabled: true },
  { id: "workout", title: "Workout alerts", description: "Reminder 30 minutes before your planned workout.", enabled: true },
  { id: "meal", title: "Meal tracking nudges", description: "Prompt after meal windows to log nutrition.", enabled: false },
  { id: "sleep", title: "Sleep routine", description: "Bedtime and wake-up consistency reminders.", enabled: false },
  { id: "achievement", title: "Achievement updates", description: "Notify when badges and streaks are unlocked.", enabled: true },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setSaved(false);
    setSettings((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  };

  return (
    <section className="space-y-5 pb-20 md:pb-4">
      <div>
        <h2 className="text-2xl font-semibold">Notification Management</h2>
        <p className="text-sm text-slate-400">Control reminders, alerts, and engagement messages.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Hydration", icon: Waves, status: "Active" },
          { label: "Workout", icon: CalendarClock, status: "Active" },
          { label: "Achievements", icon: Trophy, status: "Smart" },
          { label: "Reminders", icon: BellRing, status: "Adaptive" },
        ].map((item) => (
          <Card key={item.label} className="surface-soft rounded-2xl bg-[var(--surface-soft)]">
            <Card.Content className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm font-semibold text-violet-300">{item.status}</p>
              </div>
              <item.icon size={18} className="text-slate-300" />
            </Card.Content>
          </Card>
        ))}
      </div>
      <Card className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content>
          <div className="space-y-3">
            {settings.map((item) => (
              <Card key={item.id} className="border border-[var(--border)] bg-[var(--surface-soft)]">
                <Card.Content className="flex items-center justify-between gap-4">
                  <div className="pr-4">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                  <Switch isSelected={item.enabled} onChange={() => toggle(item.id)}>
                    {item.enabled ? "Enabled" : "Disabled"}
                  </Switch>
                </Card.Content>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={() => setSaved(true)} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white">
              Save notification settings
            </Button>
            {saved && <p className="text-sm text-emerald-400">Notification preferences saved.</p>}
          </div>
        </Card.Content>
      </Card>
    </section>
  );
}
