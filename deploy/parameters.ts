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
  callbackGasLimit: parseInt(process.env.CALLBACK_GAS_LIMIT || "100000"),
  requestConfirmations: parseInt(process.env.REQUEST_CONFIRMATIONS || "3"),
  minRange: parseInt(process.env.MIN_RANGE || "1"),
  maxRange: parseInt(process.env.MAX_RANGE || "10"),
  baseURI: process.env.BASE_URI,
};
