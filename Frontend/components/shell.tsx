"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAppSelector } from "@/hooks/redux";
import { Avatar, Button, Dropdown } from "@heroui/react";
import { Bell, Bot, Dumbbell, Home, Salad, Sparkles, Target, TrendingUp } from "lucide-react";
import ParticleBackground from "@/components/particle-background";

const links = [
  { href: "/dashboard", label: "Dashboard", short: "Home", icon: Home },
  { href: "/dashboard/meals", label: "Meal Tracker", short: "Meals", icon: Salad },
  { href: "/dashboard/diet-planner", label: "Diet Planner", short: "Diet", icon: Target },
  { href: "/dashboard/workouts", label: "Workouts", short: "Train", icon: Dumbbell },
  { href: "/dashboard/progress", label: "Progress", short: "Stats", icon: TrendingUp },
  { href: "/dashboard/coach", label: "AI Coach", short: "Coach", icon: Bot },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="relative h-screen bg-[radial-gradient(circle_at_10%_0%,#7c3aed33_0%,transparent_28%),radial-gradient(circle_at_80%_100%,#0ea5e933_0%,transparent_26%),linear-gradient(180deg,#030918_0%,#020617_100%)] overflow-hidden">
      <ParticleBackground />
      <div className="relative flex h-full w-full">
        <aside className="sticky top-0 hidden h-screen w-72 border-r border-[var(--border)] bg-[var(--surface)] px-5 py-6 md:block flex-shrink-0 overflow-y-auto">
          <div className="mb-7 flex items-center gap-3 px-2">
            <div className="rounded-xl bg-[var(--accent-soft)] p-2.5">
              <Dumbbell size={18} className="text-violet-300" />
            </div>
            <div>
              <p className="panel-heading">Website</p>
              <h2 className="text-lg font-semibold tracking-wide">GYM AI</h2>
            </div>
          </div>
          <nav className="space-y-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/20"
                    : "text-slate-300 hover:bg-[var(--surface-muted)]"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex h-screen w-full flex-col overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 backdrop-blur md:px-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="panel-heading">Welcome back</p>
                <h1 className="text-base font-semibold md:text-lg">
                  {greeting}, {user?.name ?? "Athlete"}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="tertiary" className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-slate-300">
                  <Sparkles size={15} />
                  AI Mode Active
                </Button>
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button isIconOnly variant="secondary" className="relative rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]" aria-label="Notifications">
                      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
                      <Bell size={16} />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Popover>
                    <Dropdown.Menu>
                      <Dropdown.Item id="n1">Hydration reminder in 20m</Dropdown.Item>
                      <Dropdown.Item id="n2">Coach generated new meal tweak</Dropdown.Item>
                      <Dropdown.Item id="n3">Workout session starts at 6:30 PM</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button variant="tertiary" className="rounded-full border border-[var(--border)] p-0" aria-label="Open user menu">
                      <Avatar size="sm">
                        <Avatar.Fallback>
                          {(user?.name || "User").slice(0, 2).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar>
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Popover>
                    <Dropdown.Menu>
                      <Dropdown.Item id="profile">
                        <Link href="/dashboard/profile">Profile</Link>
                      </Dropdown.Item>
                      <Dropdown.Item id="settings">
                        <Link href="/dashboard/notifications">Settings</Link>
                      </Dropdown.Item>
                      <Dropdown.Item id="logout" className="text-red-500">
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 custom-scrollbar md:p-6">{children}</main>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex gap-1 border-t border-[var(--border)] bg-[var(--surface)]/95 p-2 backdrop-blur md:hidden">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center rounded-md px-2 py-2 text-center text-[11px] ${
              pathname === item.href ? "bg-violet-600 text-white" : "text-slate-300"
            }`}
          >
            <item.icon size={14} />
            {item.short}
          </Link>
        ))}
      </nav>
    </div>
  );
}
