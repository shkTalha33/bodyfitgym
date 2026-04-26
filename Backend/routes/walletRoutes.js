const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { getWalletDashboard, getWalletNotifications } = require("../controllers/walletController");

const router = express.Router();

router.get("/summary", requireAuth, getWalletDashboard);
router.get("/notifications", requireAuth, getWalletNotifications);

module.exports = router;
