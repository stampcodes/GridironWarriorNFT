import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import parameters from "../../deploy/parameters";

const RandomAndNFTModule = buildModule("RandomAndNFTModule", (m) => {
  const randomNumberGenerator = m.contract("RandomNumberGenerator", [
    parameters.subscriptionId,
    parameters.keyHash,
    parameters.callbackGasLimit,
    parameters.requestConfirmations,
    parameters.minRange,
    parameters.maxRange,
  ]);

  const gridironWarriorNFT = m.contract("GridironWarriorNFT", [
    randomNumberGenerator,
    parameters.baseURI,
  ]);

  return { randomNumberGenerator, gridironWarriorNFT };
});

export default RandomAndNFTModule;
