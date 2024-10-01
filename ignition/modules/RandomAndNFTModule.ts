import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import parameters from "../../deploy/parameters";

const existingRandomNumberGeneratorAddress =
  "0x02fbB7cc9C164363Be267bB877801BC50aA78d1F";

const RandomAndNFTModule = buildModule("RandomAndNFTModule", (m) => {
  // const randomNumberGenerator = existingRandomNumberGeneratorAddress
  //   ? m.contractAt(
  //       "RandomNumberGenerator",
  //       existingRandomNumberGeneratorAddress
  //     )
  //   : m.contract("RandomNumberGenerator", [
  //       parameters.subscriptionId,
  //       parameters.keyHash,
  //       parameters.callbackGasLimit,
  //       parameters.requestConfirmations,
  //       parameters.minRange,
  //       parameters.maxRange,
  //     ]);

  const randomNumberGenerator = m.contractAt(
    "RandomNumberGenerator",
    existingRandomNumberGeneratorAddress
  );

  const gridironWarriorNFT = m.contract("GridironWarriorNFT", [
    randomNumberGenerator,
    parameters.baseURI,
  ]);

  return { randomNumberGenerator, gridironWarriorNFT };
});

export default RandomAndNFTModule;
