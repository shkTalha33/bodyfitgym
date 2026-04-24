"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutLocally } from "@/store/slices/authSlice";
import { Avatar, Button, Dropdown } from "@heroui/react";
import { Bell, Bot, Dumbbell, Home, Salad, Sparkles, Target, TrendingUp, UserRound } from "lucide-react";
import ParticleBackground from "@/components/particle-background";

const dashboardFont = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const links = [
  { href: "/dashboard", label: "Dashboard", short: "Home", icon: Home },
  { href: "/dashboard/meals", label: "Meal Tracker", short: "Meals", icon: Salad },
  { href: "/dashboard/diet-planner", label: "Diet Planner", short: "Diet", icon: Target },
  { href: "/dashboard/workouts", label: "Workouts", short: "Train", icon: Dumbbell },
  { href: "/dashboard/progress", label: "Progress", short: "Stats", icon: TrendingUp },
  { href: "/dashboard/coach", label: "AI Coach", short: "Coach", icon: Bot },
  { href: "/dashboard/profile", label: "Profile", short: "Profile", icon: UserRound },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleUserMenu = useCallback(
    (key: string | number) => {
      const k = String(key);
      if (k === "profile") router.push("/dashboard/profile");
      else if (k === "settings") router.push("/dashboard/notifications");
      else if (k === "logout") {
        dispatch(logoutLocally());
        router.push("/auth/login");
      }
    },
    [dispatch, router]
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div
      className={`${dashboardFont.className} relative h-screen overflow-hidden bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(244,30,30,0.12),transparent),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(244,30,30,0.06),transparent),linear-gradient(180deg,#0a0a0a_0%,#0f0f0f_100%)]`}
    >
      <ParticleBackground variant="bodyfit" />
      <div className="relative flex h-full w-full">
        <aside className="sticky top-0 hidden h-screen w-72 border-r border-[var(--border)] bg-[var(--surface)] px-5 py-6 md:block flex-shrink-0 overflow-y-auto">
<div className="flex justify-center">

          <Link href="/dashboard" className="mb-7 flex items-center gap-3 px-2 transition-opacity hover:opacity-90">
            <Image
              src="/images/logo/bodyfitlogo.png"
              alt="Body Fit"
              width={160}
              height={48}
              className="h-11 w-auto max-w-[9.5rem] object-contain object-left"
              priority
            />
          </Link>
</div>
          <nav className="space-y-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  pathname === item.href
                    ? "bg-[#F41E1E] text-white shadow-lg shadow-[#F41E1E]/25"
                    : "text-neutral-300 hover:bg-[var(--surface-muted)]"
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="min-w-0">
                  <p className="panel-heading">Welcome back</p>
                  <h1 className="text-base font-semibold md:text-lg">
                    {greeting}, {user?.name ?? "Athlete"}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="tertiary"
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-neutral-200"
                >
                  <Sparkles size={15} className="text-[#F41E1E]" />
                  AI Mode Active
                </Button>
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button isIconOnly variant="secondary" className="relative rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]" aria-label="Notifications">
                      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F41E1E]" />
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
                    <Dropdown.Menu onAction={handleUserMenu}>
                      <Dropdown.Item id="profile" textValue="Profile">
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item id="settings" textValue="Settings">
                        Settings
                      </Dropdown.Item>
                      <Dropdown.Item id="logout" className="text-red-500" textValue="Logout">
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
            className={`flex flex-1 flex-col items-center justify-center rounded-md px-2 py-2 text-center text-[11px] font-semibold ${
              pathname === item.href ? "bg-[#F41E1E] text-white" : "text-neutral-400"
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
