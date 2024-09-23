import { type BaseError } from "wagmi";

interface MintNFTProps {
  handleMintRequest(e: React.FormEvent<HTMLFormElement>): Promise<void>;
  mintRequestHash: `0x${string}` | undefined;
  isMintRequestPending: boolean;
  isMintRequestConfirming: boolean;
  isMintRequestConfirmed: boolean;
  mintRequestError: any;
}

const RequestMint: React.FC<MintNFTProps> = ({
  handleMintRequest,
  mintRequestHash,
  isMintRequestPending,
  isMintRequestConfirming,
  isMintRequestConfirmed,
  mintRequestError,
}) => {
  return (
    <>
      <form onSubmit={handleMintRequest}>
        <button disabled={isMintRequestPending} type="submit">
          {isMintRequestPending ? "Confirming..." : "Mint"}
        </button>
        {mintRequestHash && <div>Transaction Hash: {mintRequestHash}</div>}
        {isMintRequestConfirming && <div>Waiting for confirmation...</div>}
        {isMintRequestConfirmed && <div>Transaction confirmed.</div>}
        {mintRequestError && (
          <div>
            Error:{" "}
            {(mintRequestError as BaseError).shortMessage ||
              mintRequestError.message}
          </div>
        )}
      </form>
    </>
  );
};

export default RequestMint;
