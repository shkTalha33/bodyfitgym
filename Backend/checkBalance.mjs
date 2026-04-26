import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: "TEST_API_KEY:563d7903f56f814d53d3a707ac108046:68b444534876781b3180f2fe9ba98853",
  entitySecret: "bf7cf049bfa4de246b59ffadb7c588787402cb68fc38557a0ec642e8b6a9a8ea",
});

console.log("Client keys:", Object.keys(client));
console.log("Client prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
console.log("Full client:", JSON.stringify(client, null, 2));