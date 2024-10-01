import { useReadContract } from "wagmi";
import contractAbiNFT from "../abi/contractAbiNFT.json";

const useFindMyNFT = () => {
  const {
    data: nftUri,
    error,
    isPending,
    refetch,
  } = useReadContract({
    address: "0x1F6c65610cC400A0e2E7Dca6C2B9B5aE4Be639Cc",
    abi: contractAbiNFT.abi,
    functionName: "findMyNFT",
  });

  const handleFetchNFT = async () => {
    await refetch();
  };

  return {
    nftUri,
    error,
    isPending,
    handleFetchNFT,
  };
};

export default useFindMyNFT;
