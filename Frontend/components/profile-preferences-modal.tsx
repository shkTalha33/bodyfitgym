"use client";

import ProfilePreferencesForm from "@/components/profile-preferences-form";
import type { AuthUser } from "@/lib/user-normalize";
import { Button } from "@heroui/react";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (user: AuthUser) => void;
  initialUser?: AuthUser | null;
  title?: string;
};

export default function ProfilePreferencesModal({
  isOpen,
  onClose,
  onSaved,
  initialUser,
  title = "Set your training profile",
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <h2 id="profile-modal-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-[var(--surface-soft)] hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <ProfilePreferencesForm
            initialUser={initialUser ?? null}
            onSuccess={(u) => {
              onSaved(u);
              onClose();
            }}
            onCancel={onClose}
            submitLabel="Save & continue"
            showCancel
            intro="Choose from the lists below so AI meal plans, diet planner, workouts, and coach use your real targets."
          />
        </div>
      </div>
    </div>
  );
}
