/** First half · *** · second half (non-overlapping). Short strings returned as-is. */
export function maskAddressMiddle(addr: string | null | undefined): string {
  const a = (addr || "").trim();
  if (!a) return "—";
  const n = a.length;
  if (n <= 10) return a;
  const mid = Math.floor(n / 2);
  return `${a.slice(0, mid)}***${a.slice(mid)}`;
}
