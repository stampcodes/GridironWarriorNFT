import * as dotenv from "dotenv";
dotenv.config();

if (
  !process.env.SUBSCRIPTION_ID ||
  !process.env.KEY_HASH ||
  !process.env.BASE_URI
) {
  throw new Error("Missing necessary environment variables in .env");
}

export default {
  subscriptionId: BigInt(process.env.SUBSCRIPTION_ID),
  keyHash: process.env.KEY_HASH,
  vrfCoordinator: process.env.VRF_COORDINATOR || "",
  callbackGasLimit: parseInt(process.env.CALLBACK_GAS_LIMIT || ""),
  requestConfirmations: parseInt(process.env.REQUEST_CONFIRMATIONS || ""),
  minRange: parseInt(process.env.MIN_RANGE || ""),
  maxRange: parseInt(process.env.MAX_RANGE || ""),
  baseURI: process.env.BASE_URI,
};
