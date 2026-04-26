const { initiateDeveloperControlledWalletsClient } = require("@circle-fin/developer-controlled-wallets");
const env = require("../config/env");

let _client;

function getCircleClient() {
  if (!_client) {
    if (!env.circleApiKey || !env.circleEntitySecret) {
      throw new Error("Circle API is not configured (CIRCLE_API_KEY / CIRCLE_ENTITY_SECRET).");
    }
    _client = initiateDeveloperControlledWalletsClient({
      apiKey: env.circleApiKey,
      entitySecret: env.circleEntitySecret,
    });
  }
  return _client;
}

module.exports = { getCircleClient };
