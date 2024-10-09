import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import parameters from "../../deploy/parameters";

const RandomAndNFTModule = buildModule("moduleNFT", (m) => {
  const gridironWarriorNFT = m.contract("GridironWarriorNewNFT", [
    parameters.subscriptionId,
    parameters.keyHash,
    parameters.vrfCoordinator,
    parameters.baseURI,
    parameters.minRange,
    parameters.maxRange,
  ]);

  return { gridironWarriorNFT };
});

export default RandomAndNFTModule;
