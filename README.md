# GridironWarriorNFT

**GridironWarriorNFT** is a limited NFT collection project built on Ethereum and deployed on the Sepolia network. It uses Hardhat for smart contract development and deployment, and Chainlink VRF for generating random numbers, ensuring uniqueness and unpredictability of the NFTs.

## Overview

This project creates a limited collection of 10 unique NFTs, each representing a "Gridiron Warrior - QB Edition". Users can mint an NFT for a fee (0.01 ETH) and receive a randomly generated token from the collection, using Chainlink VRF to guarantee randomness.

## Status of the Project

The **GridironWarriorNFT** project is currently in development. The **smart contracts** have been fully implemented, tested, and deployed on the Sepolia network. The **frontend** is currently under development and will be added in future updates.

### Completed:

- Smart contracts for minting NFTs using Chainlink VRF and Hardhat.
- Integration with IPFS for decentralized storage of NFT metadata.
- Deployed contracts on the Sepolia test network.

### In Progress:

- Frontend interface for interacting with the smart contracts.
- User-friendly minting and NFT management interface.

## Features

- **Limited Minting**: Only 10 NFTs can be minted.
- **Random Number Generation**: Each NFT is generated randomly using Chainlink VRF to ensure uniqueness.
- **Blockchain Integration**: Deployed on the Sepolia network with Ethereum payments support.
- **Decentralized Solution**: The project leverages decentralized hosting for assets via IPFS.
- **Mint Price**: 0.01 ETH per mint.
- **Mint Request**: Users can request to mint and wait for the generation of their NFT.
- **Interactive Interface**: Users can control and verify their NFT via the smart contract.

## Technology Stack

- **Solidity**: Smart contract programming language.
- **Hardhat**: Tool for developing and deploying Ethereum smart contracts.
- **Chainlink VRF**: Secure and verifiable random number generation.
- **OpenZeppelin**: Contract libraries for ERC721 and ownership management.
- **IPFS**: Decentralized hosting for NFT metadata.
- **Sepolia Testnet**: Ethereum test network used for deployment.

## Smart Contract Addresses

- **RandomNumberGenerator**: `0x02fbB7cc9C164363Be267bB877801BC50aA78d1F`
- **GridironWarriorNFT**: `0x1F6c65610cC400A0e2E7Dca6C2B9B5aE4Be639Cc`

## How to Use

1. Clone the repository:

```bash
git clone https://github.com/stampcodes/gridironWarriorNFT.git
```

2. Navigate to the project directory:

```bash
cd gridironWarriorNFT
```

3. Install the dependencies:

```bash
npm install
```

4. Set up the .env file with your private key and Sepolia network endpoint.

5. Compile the contract:

```bash
npx hardhat compile
```

6. Run tests to verify everything works correctly:

```bash
npx hardhat test
```

7. Deploy the contract to Sepolia:

```bash
npx hardhat ignition deploy ignition/modules/RandomAndNFTModule.ts --network sepolia
```

## Deployment

The contract is deployed on the Sepolia network using Hardhat, and can be monitored via the contract addresses provided above. The NFT metadata is hosted on IPFS to ensure asset decentralization.

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

Project created by Andrea Fragnelli.
