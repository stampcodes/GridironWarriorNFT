import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ethers } from "ethers";
import contractAbiNFT from "../abi/contractAbiNFT.json";

const useMintRequest = () => {
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
      address: "0xDd1Db6811f28C0a2265f6c2B78df2AB945d8c0cc",
      abi: contractAbiNFT.abi,
      functionName: "mintNFT",
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

export default useMintRequest;
