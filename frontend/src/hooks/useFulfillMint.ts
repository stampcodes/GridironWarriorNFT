import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contractAbiNFT from "../abi/contractAbiNFT.json";

const useMintRequest = () => {
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
      address: "0xDd1Db6811f28C0a2265f6c2B78df2AB945d8c0cc",
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

export default useMintRequest;
