import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contractAbiNFT from "../abi/contractAbiNFT.json";

const useFulfillMint = () => {
  const {
    data: hash,
    error: fulfillMintError,
    isPending: isFulfillMintPending,
    writeContract,
  } = useWriteContract();

  const fulfillMintHash = hash;

  async function handleFulfillMint(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    writeContract({
      address: "0x1F6c65610cC400A0e2E7Dca6C2B9B5aE4Be639Cc",
      abi: contractAbiNFT.abi,
      functionName: "fulfillMint",
      args: [],
    });
  }

  const {
    isLoading: isFulfillMintConfirming,
    isSuccess: isFulfillMintConfirmed,
  } = useWaitForTransactionReceipt({
    hash: fulfillMintHash,
  });

  return {
    handleFulfillMint,
    fulfillMintHash,
    fulfillMintError,
    isFulfillMintPending,
    isFulfillMintConfirming,
    isFulfillMintConfirmed,
  };
};

export default useFulfillMint;
