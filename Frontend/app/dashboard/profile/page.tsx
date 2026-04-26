"use client";

import { ProfilePageSkeleton } from "@/components/app-skeletons";
import ProfilePreferencesModal from "@/components/profile-preferences-modal";
import ProfilePreferencesForm from "@/components/profile-preferences-form";
import api from "@/lib/api";
import { normalizeUser, type AuthUser } from "@/lib/user-normalize";
import { setAuthUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button, Card, ProgressBar } from "@heroui/react";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((s) => s.auth.user);
  const [profile, setProfile] = useState<AuthUser | null>(reduxUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedHint, setSavedHint] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/users/me");
      const u = normalizeUser(data as Record<string, unknown>);
      if (u) {
        setProfile(u);
        dispatch(setAuthUser(u));
      }
    } finally {
      setInitialized(true);
    }
  }, [dispatch]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (reduxUser) setProfile(reduxUser);
  }, [reduxUser]);

  const u = profile;

  if (!initialized) {
    return <ProfilePageSkeleton />;
  }

  return (
    <section className="space-y-5 pb-20 md:pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Profile</h2>
          <p className="text-sm text-slate-400">
            Update your details below. Email is shown for reference only and cannot be edited here. These values drive all
            AI features.
          </p>
        </div>
        <Button className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-white md:hidden" onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-2">
            <Pencil size={16} /> Quick edit
          </span>
        </Button>
      </div>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
        <Card.Content className="space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-300">Profile completion</span>
            <span className="tabular-nums text-slate-400">{u?.profileCompletionPercent ?? 0}%</span>
          </div>
          <ProgressBar value={u?.profileCompletionPercent ?? 0} />
          {savedHint ? <p className="text-sm text-emerald-400/90">Saved.</p> : null}
        </Card.Content>
      </Card>

      {u ? (
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-2">
            <p className="text-sm font-semibold text-white">Your details</p>
            <ProfilePreferencesForm
              initialUser={u}
              onSuccess={(user) => {
                setProfile(user);
                dispatch(setAuthUser(user));
                setSavedHint(true);
                setTimeout(() => setSavedHint(false), 3000);
              }}
              submitLabel="Save profile"
              intro="Edit any field except email, then save. To change email, contact support or use account recovery on the auth provider you used."
            />
          </Card.Content>
        </Card>
      ) : (
        <p className="text-sm text-slate-400">Could not load profile.</p>
      )}

      <ProfilePreferencesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialUser={u}
        title="Update training profile"
        onSaved={(user) => {
          setProfile(user);
          dispatch(setAuthUser(user));
          setModalOpen(false);
        }}
      />
    </section>
  );
}
