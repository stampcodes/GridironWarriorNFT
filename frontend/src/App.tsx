import RequestMint from "./components/RequestMint";
import Navbar from "./components/Navbar";
import NFTimg from "./components/NFTimg";

import useMintRequest from "./hooks/useMintRequest";

function App() {
  const {
    handleMintRequest,
    mintRequestHash,
    mintRequestError,
    isMintRequestPending,
    isMintRequestConfirming,
    isMintRequestConfirmed,
  } = useMintRequest();

  return (
    <>
      <div className="h-[100vh] w-[100%]">
        <Navbar />
        <NFTimg />
        <RequestMint
          handleMintRequest={handleMintRequest}
          mintRequestHash={mintRequestHash}
          isMintRequestPending={isMintRequestPending}
          isMintRequestConfirming={isMintRequestConfirming}
          isMintRequestConfirmed={isMintRequestConfirmed}
          mintRequestError={mintRequestError}
        />
      </div>
    </>
  );
}

export default App;
