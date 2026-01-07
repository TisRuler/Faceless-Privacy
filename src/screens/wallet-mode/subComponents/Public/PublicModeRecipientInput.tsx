import React, { useEffect } from "react";
import { ToggleDropdown } from "../Shared/ToggleDropdown";
import { PublicModeDestination } from "~~/src/shared/enums";
import { getPaymentLinkParams } from "../../utils/transactions/proccessors/other/getPaymentLinkParams";

interface PublicModeRecipientInputProps {
  recipientAddress: string;
  destination: PublicModeDestination;
  yourPrivateAddress: string;
  setPublicModeDestination: (destination: PublicModeDestination) => void;
  setRecipientAddress: (value: string) => void;
}

export const PublicModeRecipientInput: React.FC<PublicModeRecipientInputProps> = ({
  recipientAddress,
  destination,
  yourPrivateAddress,
  setPublicModeDestination,
  setRecipientAddress,
}) => {
  
  const paymentLink = getPaymentLinkParams();

  // Handle setting default
  const handleDestinationChoice = (destination: PublicModeDestination) => {
    const isToSelf = destination === PublicModeDestination.ConnectedPrivateAddress;
    const isToLinkSendersAddress = destination === PublicModeDestination.LinkSendersAddress && paymentLink.recipientRailgunAddress;

    setPublicModeDestination(destination);
    setRecipientAddress(
      isToLinkSendersAddress ? paymentLink.recipientRailgunAddress : 
      isToSelf ? yourPrivateAddress : ""
    );
  };

  // Flags
  const isToConnectedPrivateAddress = destination === PublicModeDestination.ConnectedPrivateAddress;
  const isToOtherPrivateAddress = destination === PublicModeDestination.OtherPrivateAddress;
  const isToOtherPublicAddress = destination === PublicModeDestination.OtherPublicAddress;
  const isToLinkSendersAddress = destination === PublicModeDestination.LinkSendersAddress;
  const isDisplayingStaticInputBox = isToConnectedPrivateAddress || isToLinkSendersAddress;

  // Handle recipient address updates based on private address connection
  useEffect(() => {

    if (yourPrivateAddress && isToConnectedPrivateAddress) {
      setRecipientAddress(yourPrivateAddress);
    } else if (!yourPrivateAddress && isToConnectedPrivateAddress) {
      setRecipientAddress("");
    }

  }, [yourPrivateAddress]);

  // Ui
  const placeholderInputText = isToOtherPrivateAddress
    ? "Enter a Private Address..."
    : isToOtherPublicAddress
      ? "Enter a Public Address..."
      : "Error";

  const destinationText = isDisplayingStaticInputBox
    ? ""
    : isToOtherPrivateAddress
      ? "Private"
      : "Public";

  const inputBoxStyle = "text-main-base bg-black px-4 font-isb py-2 text-base border-[0.12em] sm:border border-r-0 border-main-base rounded-none rounded-l-xl w-full outline-none capitalize";
  const staticInputBoxText = isToConnectedPrivateAddress ? "Your Private Address" : `${paymentLink.recipientName}'s Private Address`;

  return (
    <div className="mt-4 w-full">
      <p className="cursor-default text-left font-isb text-base">To:</p>

      <div className="mt-1 flex items-center"> 
        {isDisplayingStaticInputBox ? (
          <div className={`cursor-default ${inputBoxStyle}`}>
            {staticInputBoxText}
          </div>
        ) : (
          <input
            onChange={(e) => setRecipientAddress(e.target.value)}
            value={recipientAddress}
            type="text"
            className={inputBoxStyle}
            placeholder={placeholderInputText}
          />
        )}
        
        <ToggleDropdown
          options={[
            PublicModeDestination.ConnectedPrivateAddress, 
            PublicModeDestination.OtherPrivateAddress, 
            PublicModeDestination.OtherPublicAddress,
            ...(paymentLink.valid ? [PublicModeDestination.LinkSendersAddress] : []),
          ]}
          selected={destination}
          titleText={destinationText}
          includeTitle={recipientAddress.length > 0}
          onChange={handleDestinationChoice}
        />
      </div>

    </div>
  );
};