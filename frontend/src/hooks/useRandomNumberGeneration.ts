import { useWatchContractEvent } from "wagmi";
import contractAbiRNG from "../abi/contractAbiRNG.json";
import { useState } from "react";

const useRandomNumberGeneration = () => {
  const [eventReceived, setEventReceived] = useState(false);

  useWatchContractEvent({
    address: "0xeAE68a430cAF40515D91351042CddD31B82D9f0C",
    abi: contractAbiRNG.abi,
    eventName: "RequestFulfilled",
    onLogs: (logs) => {
      logs.forEach(() => {
        setEventReceived(true);
        console.log("Evento RequestFulfilled ricevuto.");
      });
    },
    onError: (error) => {
      console.error("Errore durante il monitoraggio dell'evento:", error);
    },
  });

  return {
    eventReceived,
  };
};

export default useRandomNumberGeneration;
