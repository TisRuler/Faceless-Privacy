import React, { useEffect } from "react";
import { ToggleDropdown } from "../Shared/ToggleDropdown";
import { PublicModeDestination } from "~~/src/shared/enums";

interface PublicModeRecipientInputProps {
  recipientAddress: string;
  destination: PublicModeDestination;
  privateAddress: string;
  setPublicModeDestination: (destination: PublicModeDestination) => void;
  setRecipientAddress: (value: string) => void;
}

export const PublicModeRecipientInput: React.FC<PublicModeRecipientInputProps> = ({
  recipientAddress,
  destination,
  privateAddress,
  setPublicModeDestination,
  setRecipientAddress,
}) => {
  
  const handleDestinationChoice = (destination: PublicModeDestination) => {
    const isToSelf = destination === PublicModeDestination.ConnectedPrivateAddress;
    setPublicModeDestination(destination);
    setRecipientAddress(isToSelf ? privateAddress : "");
  };

  useEffect(() => {
    const isToSelf = destination === PublicModeDestination.ConnectedPrivateAddress;

    if (privateAddress && isToSelf) {
      setRecipientAddress(privateAddress);
    } else if (!privateAddress && isToSelf) {
      setRecipientAddress("");
    }
  }, [privateAddress]);

  const isConnectedPrivateAddress = destination === PublicModeDestination.ConnectedPrivateAddress;
  const isOtherPrivateAddress = destination === PublicModeDestination.OtherPrivateAddress;
  const isOtherPublicAddress = destination === PublicModeDestination.OtherPublicAddress;
  
  const placeholderInputText = isOtherPrivateAddress
    ? "Enter a Private Address..."
    : isOtherPublicAddress
      ? "Enter a Public Address..."
      : "Error";

  const destinationText = isConnectedPrivateAddress
    ? ""
    : isOtherPrivateAddress
      ? "Private"
      : "Public";

  // Ui
  const inputBoxStyle = "text-main-base bg-black px-4 font-isb py-2 text-base border-[0.12em] sm:border border-r-0 border-main-base rounded-none rounded-l-xl w-full outline-none";

  return (
    <div className="mt-4 w-full">
      <p className="cursor-default text-left font-isb text-base">To:</p>

      <div className="mt-1 flex items-center"> 
        {isConnectedPrivateAddress ? (
          <div className={`cursor-default ${inputBoxStyle}`}>
            Your Private Address
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
          options={[PublicModeDestination.ConnectedPrivateAddress, PublicModeDestination.OtherPrivateAddress, PublicModeDestination.OtherPublicAddress]}
          selected={destination}
          titleText={destinationText}
          includeTitle={recipientAddress.length > 0}
          onChange={handleDestinationChoice}
        />
      </div>

    </div>
  );
};