import RequestMint from "./components/RequestMint";
import Navbar from "./components/Navbar";
import useRequestToMint from "./hooks/useRequestToMint";
import useFulfillMint from "./hooks/useFulfillMint"; // Importa useFulfillMint
import FulfillMint from "./components/FulfillMint";
import ViewMyNFT from "./components/ViewMyNFT"; // Nuovo componente che mostrerà i metadati dell'NFT
import useFindMyNFT from "./hooks/useFindMyNFT";

function App() {
  const {
    handleMintRequest,
    mintRequestHash,
    mintRequestError,
    isMintRequestPending,
    isMintRequestConfirming,
    isMintRequestConfirmed,
  } = useRequestToMint();

  const {
    handleFulfillMint,
    fulfillMintHash,
    fulfillMintError,
    isFulfillMintPending,
    isFulfillMintConfirming,
    isFulfillMintConfirmed,
  } = useFulfillMint();

  const {
    nftUri,
    isPending: isFetchingNFT,
    error: nftError,
    handleFetchNFT,
  } = useFindMyNFT();

  return (
    <>
      <div className="h-[100vh] w-[100%]">
        <Navbar />
        <ViewMyNFT
          nftUri={nftUri as string | null}
          isFetchingNFT={isFetchingNFT}
          nftError={nftError}
          handleFetchNFT={handleFetchNFT}
        />
        <RequestMint
          handleMintRequest={handleMintRequest}
          mintRequestHash={mintRequestHash}
          isMintRequestPending={isMintRequestPending}
          isMintRequestConfirming={isMintRequestConfirming}
          isMintRequestConfirmed={isMintRequestConfirmed}
          mintRequestError={mintRequestError}
        />

        <FulfillMint
          handleFulfillMint={handleFulfillMint}
          fulfillMintHash={fulfillMintHash}
          isFulfillMintPending={isFulfillMintPending}
          isFulfillMintConfirming={isFulfillMintConfirming}
          isFulfillMintConfirmed={isFulfillMintConfirmed}
          fulfillMintError={fulfillMintError}
          isMintRequestConfirmedForFulFill={isMintRequestConfirmed}
        />
      </div>
    </>
  );
}

export default App;
