const env = require("../config/env");
const { getCircleClient } = require("./circleClient");

const COUNTABLE_STATES = new Set(["COMPLETE", "CONFIRMED"]);

function num(s) {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

/** Sums positive amounts, counting each distinct string value once (Circle sometimes repeats the same USDC amount). */
function sumUniquePositiveAmounts(amounts) {
  const seen = new Set();
  let sum = 0;
  for (const raw of amounts || []) {
    const n = num(raw);
    if (!(n > 0)) continue;
    const key = String(raw).trim();
    if (seen.has(key)) continue;
    seen.add(key);
    sum += n;
  }
  return sum;
}

function dedupeTransactionsById(list) {
  const byId = new Map();
  for (const t of list) {
    if (!t || t.id == null || t.id === "") continue;
    if (!byId.has(t.id)) byId.set(t.id, t);
  }
  return [...byId.values()];
}

function uniqueAmountStrings(amounts) {
  const seen = new Set();
  const out = [];
  for (const raw of amounts || []) {
    const s = String(raw).trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function normalizeTx(tx) {
  if (!tx || typeof tx !== "object") return null;
  let amounts = Array.isArray(tx.amounts) ? tx.amounts.map((a) => String(a)) : [];
  if (!amounts.length && tx.amountInUSD != null && String(tx.amountInUSD).length) {
    amounts = [String(tx.amountInUSD)];
  }
  amounts = uniqueAmountStrings(amounts);
  return {
    id: tx.id,
    state: tx.state,
    operation: tx.operation,
    createDate: tx.createDate,
    destinationAddress: tx.destinationAddress,
    sourceAddress: tx.sourceAddress,
    amounts,
    txHash: tx.txHash,
  };
}

/**
 * @param {string} walletId
 * @param {string} [merchantAddress]
 * @param {{ listPageSize?: number }} [opts] Circle allows pageSize 1–50.
 */
async function getWalletSummary(walletId, merchantAddress, opts = {}) {
  const client = getCircleClient();
  const merchant = (merchantAddress || env.circleMerchantWalletAddress || "").toLowerCase();
  const tokenId = env.circleUsdcTokenId;
  const listPageSize = Math.min(Math.max(Number(opts.listPageSize) || 50, 1), 50);

  const [walletRes, balRes, txRes] = await Promise.all([
    client.getWallet({ id: walletId }),
    client
      .getWalletTokenBalance({ id: walletId, name: "USDC" })
      .catch(() => client.getWalletTokenBalance({ id: walletId, includeAll: true }))
      .catch(() => null),
    client
      .listTransactions({ walletIds: [walletId], pageSize: listPageSize })
      .catch((err) => {
        console.error("Circle listTransactions:", err?.message || err);
        return { data: { transactions: [] } };
      }),
  ]);

  const wallet = walletRes?.data?.wallet;
  const tokenRows = balRes?.data?.tokenBalances;
  let currentBalanceUsdc = "0";

  if (Array.isArray(tokenRows) && tokenRows.length) {
    const match =
      tokenRows.find((b) => b?.token?.id === tokenId) ||
      tokenRows.find((b) => String(b?.token?.symbol || "").toUpperCase() === "USDC") ||
      tokenRows[0];
    if (match?.amount != null) currentBalanceUsdc = String(match.amount);
  }

  const rawTx = (() => {
    const d = txRes?.data;
    if (Array.isArray(d?.transactions)) return d.transactions;
    if (Array.isArray(d?.data?.transactions)) return d.data.transactions;
    return [];
  })();
  const transactions = rawTx.map(normalizeTx).filter(Boolean);

  let totalSpentUsdc = 0;
  for (const t of transactions) {
    if (!merchant || !t.destinationAddress) continue;
    if (String(t.destinationAddress).toLowerCase() !== merchant) continue;
    if (!t.state || !COUNTABLE_STATES.has(String(t.state).toUpperCase())) continue;
    for (const a of t.amounts) totalSpentUsdc += num(a);
  }

  return {
    walletAddress: wallet?.address || null,
    blockchain: wallet?.blockchain || null,
    currentBalanceUsdc,
    totalSpentUsdc: String(totalSpentUsdc),
    transactions,
  };
}

module.exports = { getWalletSummary, sumUniquePositiveAmounts };
