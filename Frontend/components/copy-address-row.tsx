"use client";

import { maskAddressMiddle } from "@/lib/format-address";
import { Button } from "@heroui/react";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  address: string | null | undefined;
  label?: string;
  className?: string;
};

export default function CopyAddressRow({ address, label = "Address", className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const full = (address || "").trim();

  const copy = useCallback(async () => {
    if (!full) return;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [full]);

  return (
    <div className={className}>
      <p className="text-xs text-slate-400">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <p className="min-w-0 flex-1 break-all font-mono text-sm text-slate-200">{maskAddressMiddle(full)}</p>
        <Button
          type="button"
          isIconOnly
          size="sm"
          variant="secondary"
          className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)]"
          onClick={() => void copy()}
          isDisabled={!full}
          aria-label="Copy full address"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </Button>
      </div>
    </div>
  );
}
