const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || "replace-me",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "replace-me-refresh",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  circleApiKey: process.env.CIRCLE_API_KEY,
  circleEntitySecret: process.env.CIRCLE_ENTITY_SECRET,
  circleWalletSetId: process.env.CIRCLE_WALLET_SET_ID,
  usdcTokenAddress: process.env.USDC_TOKEN_ADDRESS,
  agentCallPrice: process.env.AGENT_CALL_PRICE,
  contractorAddress: process.env.CONTRACTOR_ADDRESS,
  circleMerchantWalletAddress: process.env.CIRCLE_MERCHANT_WALLET_ADDRESS,
  /** Circle token id for USDC on your chain (used for agent fees). */
  circleUsdcTokenId: process.env.CIRCLE_USDC_TOKEN_ID || "15dc2b5d-0994-58b0-bf8c-3a0501148ee8",
};

module.exports = env;
