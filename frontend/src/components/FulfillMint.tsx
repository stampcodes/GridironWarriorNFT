import React from "react";

interface FulfillMintProps {
  handleFulfillMint(e: React.FormEvent<HTMLFormElement>): Promise<void>;
  fulfillMintHash: `0x${string}` | undefined;
  isFulfillMintPending: boolean;
  isFulfillMintConfirming: boolean;
  isFulfillMintConfirmed: boolean;
  fulfillMintError: any;
  isMintRequestConfirmedForFulFill: boolean;
}

const FulfillMint: React.FC<FulfillMintProps> = ({
  handleFulfillMint,
  fulfillMintHash,
  isFulfillMintPending,
  isFulfillMintConfirming,
  isFulfillMintConfirmed,
  fulfillMintError,
  isMintRequestConfirmedForFulFill,
}) => {
  return (
    <>
      {/* {isMintRequestConfirmedForFulFill && ( */}
      <div className="w-[100%]  ">
        {isFulfillMintConfirmed ? (
          <div>Mint successfully completed!</div>
        ) : (
          <form
            className="flex justify-center  flex-col items-center"
            onSubmit={handleFulfillMint}
          >
            <button
              className=" p-3 bg-[#b7441a] text-white rounded-xl w-[200px] hover:bg-[#be5630] transition duration-500 "
              disabled={isFulfillMintPending}
              type="submit"
            >
              {isFulfillMintPending
                ? "Completing the Mint..."
                : "Complete the Mint"}
            </button>
            <div className="m-3 font-bold">
              {fulfillMintHash && (
                <div>Transaction Hash: {fulfillMintHash}</div>
              )}
              {isFulfillMintConfirming && <div>Completing the Mint...</div>}
              {fulfillMintError && (
                <div>
                  Errore:{" "}
                  {fulfillMintError.message || fulfillMintError.toString()}
                </div>
              )}
            </div>
          </form>
        )}
      </div>
      {/* )} */}
    </>
  );
};

export default FulfillMint;
