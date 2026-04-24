"use client";

import ProfilePreferencesModal from "@/components/profile-preferences-modal";
import ProfilePreferencesForm from "@/components/profile-preferences-form";
import api from "@/lib/api";
import { normalizeUser, type AuthUser } from "@/lib/user-normalize";
import { setAuthUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button, Card } from "@heroui/react";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((s) => s.auth.user);
  const [profile, setProfile] = useState<AuthUser | null>(reduxUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedHint, setSavedHint] = useState(false);

  const load = useCallback(async () => {
    const { data } = await api.get("/users/me");
    const u = normalizeUser(data as Record<string, unknown>);
    if (u) {
      setProfile(u);
      dispatch(setAuthUser(u));
    }
  }, [dispatch]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (reduxUser) setProfile(reduxUser);
  }, [reduxUser]);

  const u = profile;

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
        <Card.Content className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-400">AI profile:</span>
          {u?.profileComplete ? (
            <span className="font-medium text-emerald-400">Complete</span>
          ) : (
            <span className="font-medium text-amber-400">Incomplete — save the form when everything is set</span>
          )}
          {savedHint ? <span className="text-emerald-400/90">Saved.</span> : null}
        </Card.Content>
      </Card>

      {!u ? (
        <p className="text-sm text-slate-400">Loading profile…</p>
      ) : (
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
