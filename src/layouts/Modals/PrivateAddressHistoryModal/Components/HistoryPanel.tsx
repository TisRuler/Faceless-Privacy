import React from "react";
import { PrivateAddressHistoryReceiptButton } from "./PrivateAddressHistoryReceiptButton";
import { HistoryCard } from "./HistoryCard";
import { ChainData } from "~~/src/config/chains/types";
import { PrivateTxHistoryData } from "../types";
import { Provider, FallbackProvider } from "ethers";
import { ModalCentreMessage } from "../../shared/components";

interface HistoryPanelProps {
  network: ChainData
  tokenData: PrivateTxHistoryData[];
  isLoading: boolean;
  activeStartingBlock: number;
  provider: Provider | FallbackProvider;
  yourPrivateAddress: string;
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  network,
  tokenData,
  isLoading,
  activeStartingBlock,
  provider,
  yourPrivateAddress,
}) => {

  return (
    <>
      <div className="max-h-[22em] overflow-y-scroll">
        {tokenData.length > 0 ? (
          tokenData
            .sort((a, b) => a.howLongAgo.elapsedMs - b.howLongAgo.elapsedMs)
            .map((tokenData) => (
              <HistoryCard 
                key={tokenData.txId} 
                tokenData={tokenData} 
                network={network} 
              />
            ))
        ) : !isLoading ? (
          <ModalCentreMessage message="Once you use your private address, your transaction history will appear here."/>
        ) : (
          <ModalCentreMessage message="Loading History..."/>
        )}
      </div>

      <hr className="border-3 mb-2 w-full border border-modal-accent-100" />

      <PrivateAddressHistoryReceiptButton
        network={network}
        tokenData={tokenData}
        startingBlock={activeStartingBlock}
        provider={provider}
        yourPrivateAddress={yourPrivateAddress}
      />
    </>
  );
};
