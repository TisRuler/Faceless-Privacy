import { PrivateModeDestination } from "~~/src/shared/enums";
import { ToggleDropdown } from "../Shared/ToggleDropdown";
import { getPaymentLinkParams } from "../../utils/transactions/proccessors/other/getPaymentLinkParams";

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

  const paymentLink = getPaymentLinkParams();

  // Flags
  const isLinkSendersAddress = destination === PrivateModeDestination.LinkSendersAddress;
  const isToPublicAddress = destination === PrivateModeDestination.PublicAddress;
  const isDisplayingStaticInputBox = isLinkSendersAddress;
  const inputPlaceHolderText = isToPublicAddress ? "Enter a Public Address..." : "Enter a Private Address...";

  // Main function
  const handleDestinationChoice = (destination: PrivateModeDestination) => {
    const isToLinkSendersAddress = destination === PrivateModeDestination.LinkSendersAddress && paymentLink.recipientRailgunAddress;

    setPrivateModeDestination(destination);
    setRecipientAddress(isToLinkSendersAddress ? paymentLink.recipientRailgunAddress : "");
  };
  
  // Ui
  const destinationText = isDisplayingStaticInputBox
    ? ""
    : isToPublicAddress
      ? "Public"
      : "Private";

  const inputBoxStyle = "text-main-base bg-black px-4 py-2 font-isb text-base border-[0.12em] sm:border border-r-0 border-main-base rounded-none rounded-l-xl w-full outline-none capitalize";

  return (
    <div className="mt-4 w-full">

      <p className="cursor-default text-left font-isb text-base">To:</p>

      <div className="mt-1 flex items-center">
        {isDisplayingStaticInputBox ? (
          <div className={`cursor-default ${inputBoxStyle}`}>
            {paymentLink.recipientName}'s Private Address
          </div>
        ) : (
          <input
            onChange={(e) => setRecipientAddress(e.target.value)}
            value={recipientAddress}
            type="text"
            className={inputBoxStyle}
            placeholder={inputPlaceHolderText}
          />
        )}
        
        <ToggleDropdown
          options={[
            PrivateModeDestination.PublicAddress, 
            PrivateModeDestination.PrivateAddress,
            ...(paymentLink.valid ? [PrivateModeDestination.LinkSendersAddress] : []),
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
