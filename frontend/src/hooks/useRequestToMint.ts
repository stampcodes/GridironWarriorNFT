import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ethers } from "ethers";
import contractAbiNFT from "../abi/contractAbiNFT.json";

const useRequestToMint = () => {
  const {
    data: hash,
    error: mintRequestError,
    isPending: isMintRequestPending,
    writeContract,
  } = useWriteContract();

  const mintRequestHash = hash;

  async function handleMintRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    writeContract({
      address: "0x1F6c65610cC400A0e2E7Dca6C2B9B5aE4Be639Cc",
      abi: contractAbiNFT.abi,
      functionName: "requestToMint",
      args: [],
      value: ethers.parseEther("0.01"),
    });
  }

  const {
    isLoading: isMintRequestConfirming,
    isSuccess: isMintRequestConfirmed,
  } = useWaitForTransactionReceipt({
    hash: mintRequestHash,
  });

  return {
    handleMintRequest,
    mintRequestHash,
    mintRequestError,
    isMintRequestPending,
    isMintRequestConfirming,
    isMintRequestConfirmed,
  };
};

export default useRequestToMint;
