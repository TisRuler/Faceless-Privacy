import React, { useState } from "react";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { handleCopyToClipboard } from "~~/src/layouts/Modals/shared/utils/handleCopyToClipboard";
import { ChainData } from "~~/src/config/chains/types";

const HIDDEN_TEXT = "Hidden 0zk Address";
const RELAY_ADAPT_CONTRACT_TEXT = "Relay Adapt Contract";
  
interface CopyAddressToClipboardProps {
  network: ChainData
  tag?: string;
  address?: string;
  colourClass: string;
}

export const CopyAddressToClipboard: React.FC<CopyAddressToClipboardProps> = ({ network, address, tag, colourClass }) => {
  const [addressCopied, setAddressCopied] = useState(false);

  const isAddressVisible = Boolean(address);
  const isAddressRelayAdaptContract = address === network.relayAdaptContract;

  const textToCopy = isAddressRelayAdaptContract ? `${address} (${RELAY_ADAPT_CONTRACT_TEXT})` : address || HIDDEN_TEXT;

  const textToDisplay = isAddressRelayAdaptContract
    ? RELAY_ADAPT_CONTRACT_TEXT
    : address
      ? (() => {
        const firstHalf = address.slice(0, 7);
        const secondHalfLength = 6;

        const secondHalf = address.slice(-secondHalfLength);
        return `${firstHalf}...${secondHalf}`;
      })()
      : HIDDEN_TEXT;

  const handleOnClick = () => {
    if (!isAddressVisible) return;

    handleCopyToClipboard(textToCopy);
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 800);
  };

  const CopyAddressIcon = addressCopied ? CheckCircleIcon : DocumentDuplicateIcon;

  return (
    <div className={`flex items-center ${colourClass}`}>
      {address === "RPC Issue … View Tx hash" ? (

        <p className="font-im text-modal-100">
          <span className="text-modal-base">{tag}</span> Try a different RPC or click the link below
        </p>
      
      ) : (

        <>
          <p className={"font-im text-modal-base"}>{tag}</p>
          
          <div
            onClick={handleOnClick}
            className="flex cursor-pointer items-center"
          >
            <p className={"ml-1 font-im"}>{textToDisplay}</p>

            {isAddressVisible && 
              <CopyAddressIcon
                className="mb-[2px] ml-1 h-4 w-4 cursor-pointer text-xl"
                aria-hidden="true"
                strokeWidth={2}
              />
            }
            
          </div>
        </>

      )}
    </div>
  );
};