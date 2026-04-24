"use client";

import { useAppSelector } from "@/hooks/redux";
import Shell from "@/components/shell";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/auth/login");
  }, [router, user]);

  if (!user) return null;

  return <Shell>{children}</Shell>;
}
