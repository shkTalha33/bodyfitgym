import { Card } from "@heroui/react";

const pulse = "animate-pulse bg-neutral-800/60";

/** Single pulsing block; use inside tables/cards for fine-grained placeholders */
export function Sk({ className }: { className?: string }) {
  return <div className={`${pulse} rounded-xl ${className ?? ""}`} aria-hidden />;
}

/** Matches dashboard home: hero, 4 stat cards, 3 saved cards, 2-col + recs, 3-col charts */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(125deg,#1a1a1a_0%,#141414_45%,#1f1515_100%)] p-6">
        <Sk className="mb-3 h-3 w-24" />
        <Sk className="mb-2 h-8 w-64 max-w-full" />
        <Sk className="h-4 w-full max-w-2xl" />
        <Sk className="mt-2 h-4 w-full max-w-xl" />
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["a", "b", "c", "d"].map((k) => (
          <Card key={k} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content className="flex items-center justify-between">
              <Sk className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="space-y-2 text-right">
                <Sk className="ml-auto h-3 w-28" />
                <Sk className="ml-auto h-6 w-20" />
                <Sk className="ml-auto h-3 w-32" />
              </div>
            </Card.Content>
          </Card>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {["e", "f", "g"].map((k) => (
          <Card key={k} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content className="space-y-2">
              <Sk className="h-3 w-24" />
              <Sk className="h-4 w-full" />
              <Sk className="h-3 w-2/3" />
              <Sk className="h-3 w-32" />
            </Card.Content>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] lg:col-span-2">
          <Card.Content>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Sk className="h-4 w-48" />
              <Sk className="h-3 w-full max-w-xs sm:ml-auto" />
            </div>
            <Sk className="h-72 w-full rounded-lg" />
          </Card.Content>
        </Card>
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
          <Card.Content className="space-y-3">
            <Sk className="h-4 w-36" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <Sk className="h-4 w-3/4" />
                <Sk className="h-3 w-full" />
                <Sk className="h-3 w-5/6" />
              </div>
            ))}
          </Card.Content>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <Card.Content>
              <Sk className="mb-4 h-4 w-52" />
              <Sk className="h-72 w-full rounded-lg" />
              {i === 1 ? <Sk className="mt-2 h-3 w-full" /> : null}
            </Card.Content>
          </Card>
        ))}
      </section>
    </div>
  );
}

/** Wallet: header card, 3 stat cards, transactions table */
export function WalletPageSkeleton() {
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="flex-1 space-y-3">
              <Sk className="h-3 w-28" />
              <Sk className="h-8 w-56" />
              <Sk className="h-4 w-full max-w-2xl" />
              <Sk className="h-4 w-full max-w-xl" />
            </div>
            <Sk className="h-11 w-28 shrink-0 rounded-xl" />
          </div>
        </Card.Content>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["a", "b", "c"].map((k) => (
          <Card key={k} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
            <Card.Content>
              <Sk className="mb-2 h-3 w-40" />
              <Sk className="h-8 w-32" />
            </Card.Content>
          </Card>
        ))}
      </section>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="p-0 sm:p-0">
          <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
            <Sk className="mb-2 h-4 w-40" />
            <Sk className="h-3 w-64" />
          </div>
          <div className="overflow-x-auto px-4 py-3 sm:px-6">
            <div className="min-w-[720px] space-y-2">
              <div className="flex gap-4 border-b border-[var(--border)] pb-2">
                <Sk className="h-3 flex-1" />
                <Sk className="h-3 w-20" />
                <Sk className="h-3 w-24" />
                <Sk className="h-3 w-40" />
              </div>
              {[1, 2, 3, 4, 5].map((r) => (
                <div key={r} className="flex gap-4 py-3">
                  <Sk className="h-4 flex-1" />
                  <Sk className="h-4 w-20" />
                  <Sk className="h-4 w-28" />
                  <Sk className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

/** Profile: progress card + form card */
export function ProfilePageSkeleton() {
  return (
    <section className="space-y-5 pb-20 md:pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="space-y-2">
          <Sk className="h-8 w-32" />
          <Sk className="h-4 w-full max-w-lg" />
          <Sk className="h-4 w-full max-w-md" />
        </div>
        <Sk className="h-10 w-36 rounded-xl md:hidden" />
      </div>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
        <Card.Content className="space-y-3">
          <div className="flex justify-between">
            <Sk className="h-4 w-40" />
            <Sk className="h-4 w-10" />
          </div>
          <Sk className="h-2 w-full rounded-full" />
        </Card.Content>
      </Card>

      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-4">
          <Sk className="h-4 w-28" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Sk className="h-3 w-24" />
              <Sk className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Sk className="h-11 w-40 rounded-xl" />
        </Card.Content>
      </Card>
    </section>
  );
}

/** Progress page: chart card only (profile row stays from Redux) */
export function ProgressWorkoutChartSkeleton() {
  return (
    <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <Card.Content>
        <Sk className="mb-2 h-4 w-56" />
        <Sk className="mb-4 h-3 w-full max-w-xl" />
        <Sk className="h-64 w-full rounded-lg" />
      </Card.Content>
    </Card>
  );
}

/** Coach sidebar chat list */
export function CoachSidebarSkeleton() {
  return (
    <div className="space-y-2" aria-hidden>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
          <Sk className="mb-2 h-4 w-full" />
          <Sk className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Diet / meals / workouts: hero + first generator card */
export function AiModulePageSkeleton() {
  return (
    <div className="space-y-4 pb-16 md:pb-4">
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="p-6">
          <Sk className="mb-2 h-3 w-32" />
          <Sk className="mb-2 h-8 w-48" />
          <Sk className="h-4 w-full max-w-2xl" />
          <Sk className="mt-2 h-4 w-full max-w-xl" />
        </Card.Content>
      </Card>
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="space-y-4">
          <div className="flex justify-between gap-3">
            <Sk className="h-5 w-40" />
            <Sk className="h-10 w-44 rounded-xl" />
          </div>
          <Sk className="h-32 w-full rounded-xl" />
        </Card.Content>
      </Card>
    </div>
  );
}
