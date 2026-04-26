const env = require("../config/env");
const { getCircleClient } = require("./circleClient");

const createUserWallet = async () => {
  const client = getCircleClient();
  const response = await client.createWallets({
    walletSetId: env.circleWalletSetId,
    blockchains: ["ARC-TESTNET"],
    count: 1,
  });

  const wallet = response.data?.wallets?.[0];
  return {
    walletId: wallet.id,
    walletAddress: wallet.address,
  };
};

module.exports = { createUserWallet };