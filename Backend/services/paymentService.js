const { v4: uuidv4 } = require("uuid");
const env = require("../config/env");
const { getCircleClient } = require("./circleClient");

/** Per-request USDC debit amounts (string decimals for Circle API). */
const AGENT_FEE_USDC = {
  COACH: "0.001",
  MEALS: "0.005",
  DIET: "0.005",
  WORKOUT: "0.008",
};

/**
 * @param {string} userWalletId
 * @param {string} amountUsdc - e.g. "0.001" or AGENT_FEE_USDC.COACH
 */
const deductAgentFee = async (userWalletId, amountUsdc) => {
  const amount = String(amountUsdc || AGENT_FEE_USDC.MEALS);
  const client = getCircleClient();
  const response = await client.createTransaction({
    walletId: userWalletId,
    destinationAddress: env.circleMerchantWalletAddress,
    amounts: [amount],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    tokenId: env.circleUsdcTokenId,
    idempotencyKey: uuidv4(),
  });

  console.log("Transaction response:", JSON.stringify(response.data, null, 2));
  return response.data?.id;
};

module.exports = { deductAgentFee, AGENT_FEE_USDC };
