"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Shell from "@/components/shell";
import { restoreSession } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    if (user) {
      setReady(true);
      return;
    }
    if (attempted.current) return;
    attempted.current = true;
    const rt = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    if (!rt) {
      router.replace("/auth/login");
      return;
    }
    void (async () => {
      const action = await dispatch(restoreSession());
      if (restoreSession.rejected.match(action)) {
        router.replace("/auth/login");
        return;
      }
      setReady(true);
    })();
  }, [dispatch, router, user]);

  if (!ready || !user) return null;

  return <Shell>{children}</Shell>;
}
