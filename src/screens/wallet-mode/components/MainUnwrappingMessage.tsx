import { ChainData } from "~~/src/config/chains/types";
import { PrivateModeDestination } from "~~/src/shared/enums";
import { useWalletModeScreenStore } from "~~/src/state-managers";

interface UnwrappingMessageProps {
    activeNetwork: ChainData
  };
  
export const MainUnwrappingMessage: React.FC<UnwrappingMessageProps> = ({
  activeNetwork
}) => {

  const feeDataToDisplay = useWalletModeScreenStore((store => store.feeDataToDisplay));
  const tokenForPrivateMode = useWalletModeScreenStore((store => store.tokenForPrivateMode));
  const privateModeDestination = useWalletModeScreenStore((store) => store.privateModeDestination);

  const isToPublicAddress = privateModeDestination === PrivateModeDestination.PublicAddress;
  const isBaseToken = tokenForPrivateMode.address === activeNetwork.privateModeBaseToken.address;

  const displayAutoUnwrapText = isToPublicAddress && isBaseToken && feeDataToDisplay;

  if (!displayAutoUnwrapText) return null;
    
  const containerClasses = "fixed top-[7.5rem] sm:top-[5.25rem] left-0 right-0 z-[1] flex justify-center m-2";
  const cardClasses = "rounded-2xl flex items-center font-im cursor-pointer whitespace-nowrap";
  const borderClasses = "sm:border border-[#B8FFAD]";
  const paddingClasses = "px-4 py-2";
  const textClasses = "text-sm sm:text-base font-isb sm:font-im text-[#B8FFAD] sm:text-white";

  return (
    <div className={containerClasses}>
      <div className={`${cardClasses} ${borderClasses} ${paddingClasses}`}>
        <p className={textClasses}>Auto-converted to {activeNetwork.publicModeBaseToken.symbol} for the recipient</p>
      </div>
    </div>
  );
};