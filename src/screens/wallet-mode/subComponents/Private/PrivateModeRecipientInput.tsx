import React from "react";
import { PrivateModeDestination } from "~~/src/shared/enums";
import { ToggleDropdown } from "../Shared/ToggleDropdown";

interface PrivateModeRecipientInputProps {
  recipientAddress: string;
  destination: PrivateModeDestination;
  setPrivateModeDestination: (destination: PrivateModeDestination) => void;
  setRecipientAddress: (value: string) => void;
}

export const PrivateModeRecipientInput: React.FC<PrivateModeRecipientInputProps> = ({
  recipientAddress,
  destination,
  setPrivateModeDestination,
  setRecipientAddress,
}) => {

  const inputPlaceHolderText = destination === PrivateModeDestination.PublicAddress ? "Enter a Public Address..." : "Enter a Private Address...";

  const handleDestinationChoice = (destination: PrivateModeDestination) => {
    setPrivateModeDestination(destination);
  };
  
  const destinationText = destination.trim().split(" ")[0];

  // Ui
  const inputBoxStyle = "text-main-base bg-black px-4 py-2 font-isb text-base border-[0.12em] sm:border border-r-0 border-main-base rounded-l-xl w-full outline-none";

  return (
    <div className="mt-4 w-full">

      <p className="cursor-default text-left font-isb text-base">To:</p>

      <div className="mt-1 flex items-center">
        <input
          onChange={(e) => setRecipientAddress(e.target.value)}
          value={recipientAddress}
          type="text"
          className={inputBoxStyle}
          placeholder={inputPlaceHolderText}
        />
        
        <ToggleDropdown
          options={[PrivateModeDestination.PublicAddress, PrivateModeDestination.PrivateAddress]}
          selected={destination}
          titleText={destinationText}
          includeTitle={recipientAddress.length > 0}
          onChange={handleDestinationChoice}
        />
 
      </div>
    </div>
  );
};
