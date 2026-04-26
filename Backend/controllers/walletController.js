const User = require("../models/User");
const Conversation = require("../models/Conversation");
const env = require("../config/env");
const { getWalletSummary } = require("../services/walletService");

const getWalletDashboard = async (req, res) => {
  const user = await User.findById(req.user.id).select("walletId walletAddress").lean();
  if (!user?.walletId) {
    return res.json({
      success: true,
      data: {
        hasWallet: false,
        walletAddress: user?.walletAddress || null,
        currentBalanceUsdc: "0",
        totalSpentUsdc: "0",
        transactions: [],
        pagination: { page: 1, limit: 20, total: 0 },
        circleConfigured: Boolean(env.circleApiKey && env.circleEntitySecret),
      },
    });
  }

  if (!env.circleApiKey || !env.circleEntitySecret) {
    return res.status(503).json({
      success: false,
      message: "Wallet service is not configured on the server.",
    });
  }

  try {
    const summary = await getWalletSummary(user.walletId, env.circleMerchantWalletAddress, { listPageSize: 50 });
    const pageRaw = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "20"), 10) || 20));
    const allTx = summary.transactions;
    const total = allTx.length;
    const pageCount = Math.max(1, Math.ceil(total / limit) || 1);
    const page = Math.min(pageRaw, pageCount);
    const start = (page - 1) * limit;
    const transactions = allTx.slice(start, start + limit);
    return res.json({
      success: true,
      data: {
        hasWallet: true,
        walletAddress: user.walletAddress || summary.walletAddress,
        blockchain: summary.blockchain,
        currentBalanceUsdc: summary.currentBalanceUsdc,
        totalSpentUsdc: summary.totalSpentUsdc,
        transactions,
        pagination: { page, limit, total },
        circleConfigured: true,
      },
    });
  } catch (err) {
    console.error("Wallet summary error:", err.message);
    return res.status(502).json({
      success: false,
      message: "Could not load wallet data from Circle.",
    });
  }
};

const getWalletNotifications = async (req, res) => {
  const user = await User.findById(req.user.id).select("walletId walletAddress").lean();
  const items = [];
  if (!user) {
    return res.json({ success: true, data: { items: [] } });
  }

  if (user?.walletId && env.circleApiKey && env.circleEntitySecret) {
    try {
      const summary = await getWalletSummary(user.walletId, env.circleMerchantWalletAddress);
      for (const tx of summary.transactions.slice(0, 18)) {
        const amt = tx.amounts?.length ? tx.amounts.join(", ") : "—";
        items.push({
          id: `tx-${tx.id}`,
          kind: "transaction",
          title: "Wallet transaction",
          detail: `${amt} USDC · ${tx.state || "—"}`,
          sub: tx.createDate ? new Date(tx.createDate).toISOString() : null,
        });
      }
    } catch (err) {
      console.error("Notification wallet fetch:", err.message);
    }
  }

  try {
    const convos = await Conversation.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("title updatedAt")
      .lean();
    for (const c of convos) {
      items.push({
        id: `convo-${c._id}`,
        kind: "coach",
        title: "AI Coach",
        detail: c.title || "Conversation updated",
        sub: c.updatedAt ? new Date(c.updatedAt).toISOString() : null,
      });
    }
  } catch (err) {
    console.error("Notification convo fetch:", err.message);
  }

  items.sort((a, b) => {
    const ta = a.sub ? new Date(a.sub).getTime() : 0;
    const tb = b.sub ? new Date(b.sub).getTime() : 0;
    return tb - ta;
  });

  return res.json({
    success: true,
    data: { items: items.slice(0, 28) },
  });
};

module.exports = { getWalletDashboard, getWalletNotifications };
