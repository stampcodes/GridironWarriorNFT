import React from "react";
import premint from "../assets/img/premint.png";

interface ViewMyNFTProps {
  handleFetchNFT: () => void; // Funzione per gestire il pulsante "View My NFT"
  nftUri: string | null; // URI dell'immagine NFT (può essere null)
  isFetchingNFT: boolean; // Stato di caricamento dell'NFT
  nftError: any; // Eventuale errore nella richiesta dell'NFT
}

const ViewMyNFT: React.FC<ViewMyNFTProps> = ({
  handleFetchNFT,
  nftUri,
  isFetchingNFT,
  nftError,
}) => {
  return (
    <div className="flex flex-col items-center mt-10">
      {/* Mostra l'immagine dell'NFT se è disponibile */}
      {nftUri ? (
        <img
          src={nftUri}
          className="w-[512px] h-[512px] rounded-[15px]"
          alt="My NFT"
        />
      ) : (
        // Mostra l'immagine di premint se l'NFT non è stato ancora trovato
        <img
          src={premint}
          className="w-[512px] h-[512px] rounded-[15px]"
          alt="img premint"
        />
      )}

      {/* Pulsante per richiedere la visualizzazione dell'NFT */}
      <div className="flex justify-center mt-5">
        <button
          className="p-3 bg-[#b7441a] text-white rounded-xl w-[200px] hover:bg-[#be5630] transition duration-500"
          onClick={handleFetchNFT}
          disabled={isFetchingNFT}
        >
          {isFetchingNFT ? "Loading NFT..." : "View My NFT"}
        </button>
      </div>

      {/* Stato di caricamento e messaggio di errore */}
      {isFetchingNFT && (
        <div className="flex justify-center mt-3">Loading NFT metadata...</div>
      )}
      {nftError && (
        <div className=" font-bold ">
          Error loading NFT: {nftError.message || nftError.toString()}
        </div>
      )}
    </div>
  );
};

export default ViewMyNFT;
