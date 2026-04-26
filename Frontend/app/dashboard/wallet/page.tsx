"use client";

import { Sk, WalletPageSkeleton } from "@/components/app-skeletons";
import api from "@/lib/api";
import CopyAddressRow from "@/components/copy-address-row";
import { maskAddressMiddle } from "@/lib/format-address";
import { Button, Card } from "@heroui/react";
import { ArrowDownLeft, Check, Copy, RefreshCw, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function TxDestinationCell({
  txId,
  address,
  copiedId,
  onCopied,
}: {
  txId: string;
  address?: string;
  copiedId: string | null;
  onCopied: (id: string | null) => void;
}) {
  const full = (address || "").trim();
  if (!full) return <span className="text-slate-500">—</span>;
  const copied = copiedId === txId;
  return (
    <div className="flex max-w-[260px] items-center gap-1">
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-400" title={full}>
        {maskAddressMiddle(full)}
      </span>
      <Button
        type="button"
        isIconOnly
        size="sm"
        variant="secondary"
        className="h-8 w-8 shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)]"
        aria-label="Copy destination address"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(full);
            onCopied(txId);
            window.setTimeout(() => onCopied(null), 2000);
          } catch {
            /* ignore */
          }
        }}
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      </Button>
    </div>
  );
}

type WalletTx = {
  id: string;
  state: string;
  operation?: string;
  createDate: string;
  destinationAddress?: string;
  sourceAddress?: string;
  amounts: string[];
  txHash?: string;
};

type WalletSummary = {
  hasWallet: boolean;
  walletAddress: string | null;
  blockchain?: string | null;
  currentBalanceUsdc: string;
  totalSpentUsdc: string;
  transactions: WalletTx[];
  pagination?: { page: number; limit: number; total: number };
  circleConfigured?: boolean;
};

const PAGE_SIZE = 20;

function formatUsdc(s: string) {
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

export default function WalletPage() {
  const [data, setData] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async (pageNum: number) => {
    await Promise.resolve();
    setError(null);
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: WalletSummary; message?: string }>("/wallet/summary", {
        params: { page: pageNum, limit: PAGE_SIZE },
      });
      if (!res.data.success || !res.data.data) {
        setError(res.data.message || "Could not load wallet.");
        return;
      }
      setData(res.data.data);
      setPage(res.data.data.pagination?.page ?? pageNum);
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || "Could not load wallet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load(page);
    });
  }, [load, page]);

  const spent = data ? Number(data.totalSpentUsdc) : 0;
  const balance = data ? Number(data.currentBalanceUsdc) : 0;

  if (loading && !data) {
    return <WalletPageSkeleton />;
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <Card.Content className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="panel-heading">Circle wallet</p>
              <h1 className="text-2xl font-semibold text-white">Wallet & usage</h1>
              <p className="mt-2 max-w-2xl text-sm text-neutral-400">
                USDC balance and on-chain transfers from this app. AI Coach{" "}
                <strong className="text-neutral-300">0.001 USDC</strong> per reply; Meal & Diet planners{" "}
                <strong className="text-neutral-300">0.005 USDC</strong> each; Workout generator{" "}
                <strong className="text-neutral-300">0.008 USDC</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void load(page)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--surface-strong)] disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </Card.Content>
      </Card>

      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}

      {data && !data.hasWallet ? (
        <Card className="rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <Card.Content className="p-6">
            <p className="font-semibold text-amber-200">No developer wallet on this account</p>
            <p className="mt-2 text-sm text-neutral-400">
              New signups get a wallet automatically. If you see this, your user record may pre-date wallets—sign up again or
              attach a wallet in the backend.
            </p>
          </Card.Content>
        </Card>
      ) : null}

      {data?.hasWallet ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
              <Card.Content>
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <Wallet size={14} className="text-[#f87171]" />
                  Current balance (USDC)
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatUsdc(data.currentBalanceUsdc)}</p>
              </Card.Content>
            </Card>
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]">
              <Card.Content>
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <ArrowDownLeft size={14} className="text-[#f87171]" />
                  Total sent to app (est.)
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatUsdc(data.totalSpentUsdc)}</p>
                <p className="mt-1 text-[11px] text-neutral-500">Confirmed transfers to the merchant address only.</p>
              </Card.Content>
            </Card>
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] sm:col-span-2 lg:col-span-1">
              <Card.Content>
                <CopyAddressRow address={data.walletAddress} label="Wallet address" />
                {data.blockchain ? (
                  <p className="mt-2 text-xs text-neutral-500">Chain: {data.blockchain}</p>
                ) : null}
              </Card.Content>
            </Card>
          </section>

          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <Card.Content className="p-0 sm:p-0">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <p className="text-sm font-semibold text-white">Transactions</p>
                <p className="text-xs text-neutral-500">
                  {data.pagination
                    ? `Page ${data.pagination.page} of ${Math.max(1, Math.ceil(data.pagination.total / data.pagination.limit))} · ${data.pagination.total} from Circle`
                    : "Activity from Circle."}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-soft)] text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-3 py-3 font-semibold sm:px-4">Date</th>
                      <th className="px-3 py-3 font-semibold sm:px-4">State</th>
                      <th className="px-3 py-3 font-semibold sm:px-4">Amounts</th>
                      <th className="px-3 py-3 font-semibold sm:px-4">To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [1, 2, 3, 4, 5, 6].map((i) => (
                        <tr key={i} className="border-b border-[var(--border)] align-top">
                          <td className="px-3 py-3 sm:px-4">
                            <Sk className="h-4 w-40" />
                          </td>
                          <td className="px-3 py-3 sm:px-4">
                            <Sk className="h-4 w-16" />
                          </td>
                          <td className="px-3 py-3 sm:px-4">
                            <Sk className="h-4 w-28" />
                          </td>
                          <td className="px-3 py-3 sm:px-4">
                            <Sk className="h-4 w-44 max-w-[260px]" />
                          </td>
                        </tr>
                      ))
                    ) : data.transactions.length ? (
                      data.transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-[var(--border)] last:border-0 align-top">
                          <td className="whitespace-nowrap px-3 py-3 text-slate-300 sm:px-4">
                            {tx.createDate ? new Date(tx.createDate).toLocaleString() : "—"}
                          </td>
                          <td className="px-3 py-3 text-slate-200 sm:px-4">{tx.state}</td>
                          <td className="px-3 py-3 font-mono text-slate-200 sm:px-4">
                            {tx.amounts?.length ? tx.amounts.join(", ") : "—"}
                          </td>
                          <td className="px-3 py-3 sm:px-4">
                            <TxDestinationCell
                              txId={tx.id}
                              address={tx.destinationAddress}
                              copiedId={copiedTxId}
                              onCopied={setCopiedTxId}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-slate-500 sm:px-6">
                          No transactions yet. Fund this wallet with test USDC, then use AI features.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {data.pagination && data.pagination.total > data.pagination.limit ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3 sm:px-6">
                  <p className="text-xs text-neutral-500">
                    Showing {(data.pagination.page - 1) * data.pagination.limit + 1}–
                    {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={loading || data.pagination.page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-sm text-white disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={
                        loading ||
                        data.pagination.page * data.pagination.limit >= data.pagination.total
                      }
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-sm text-white disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </Card.Content>
          </Card>

          <p className="text-xs text-neutral-500">
            Snapshot: balance <span className="text-neutral-400">{formatUsdc(String(balance))}</span> · total merchant
            debits (confirmed) <span className="text-neutral-400">{formatUsdc(String(spent))}</span>
          </p>
        </>
      ) : null}
    </div>
  );
}
