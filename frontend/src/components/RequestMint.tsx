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
      <div className="w-[100%]  ">
        <form
          className="flex justify-center mt-7 flex-col items-center"
          onSubmit={handleMintRequest}
        >
          <button
            className=" p-3 bg-[#b7441a] text-white rounded-xl w-[200px] hover:bg-[#be5630] transition duration-500 "
            disabled={isMintRequestPending}
            type="submit"
          >
            {isMintRequestPending ? "Confirming..." : "Request Mint"}
          </button>
          <div className="m-3 font-bold ">
            {mintRequestHash && <div>Transaction Hash: {mintRequestHash}</div>}
            {isMintRequestConfirming && <div>Waiting for confirmation...</div>}
            {isMintRequestConfirmed && <div>Request confirmed.</div>}
            {mintRequestError && (
              <div>
                Error:{" "}
                {(mintRequestError as BaseError).shortMessage ||
                  mintRequestError.message}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default RequestMint;
