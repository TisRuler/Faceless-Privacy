import { ChainData } from "~~/src/config/chains/types";
import { CardView, PrivateModeDestination } from "~~/src/shared/enums";
import { useWalletModeScreenStore } from "~~/src/state-managers";

interface WalletActionExplanationProps {
  activeNetwork: ChainData;
  walletModeCardView: CardView;
};
  
export const WalletActionExplanation: React.FC<WalletActionExplanationProps> = ({
  activeNetwork,
  walletModeCardView,
}) => {

  const feeDataToDisplay = useWalletModeScreenStore((store => store.feeDataToDisplay));
  const tokenForPrivateMode = useWalletModeScreenStore((store => store.tokenForPrivateMode));
  const privateModeDestination = useWalletModeScreenStore((store) => store.privateModeDestination);

  // Flags
  const isToPublicAddress = privateModeDestination === PrivateModeDestination.PublicAddress;
  const isBaseToken = tokenForPrivateMode.address === activeNetwork.privateModeBaseToken.address;
  const isViewingPrivateAddress = walletModeCardView === CardView.Private;
  const isUsingMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const displayAutoUnwrapText = isToPublicAddress && isBaseToken && feeDataToDisplay;
  const displayDesktopReliabilityText = !displayAutoUnwrapText && isUsingMobile && isViewingPrivateAddress;

  if (!displayAutoUnwrapText && !displayDesktopReliabilityText) return null;
    
  const textToDisplay = displayAutoUnwrapText ? 
    `Auto-converted to ${activeNetwork.publicModeBaseToken.symbol} for the recipient` : 
    "Transactions are more reliable on desktop";

  // Ui
  const containerClasses = "fixed top-[7.5rem] sm:top-[5.25rem] left-0 right-0 z-[1] flex justify-center m-2";
  const cardClasses = "rounded-2xl flex items-center font-im cursor-pointer whitespace-nowrap";
  const borderClasses = "border border-[#B8FFAD]";
  const paddingClasses = "px-3 py-1";
  const textClasses = "text-sm sm:text-base font-isb sm:font-im  text-white";

  return (
    <div className={containerClasses}>
      <div className={`${cardClasses} ${borderClasses} ${paddingClasses}`}>
        <p className={textClasses}>{textToDisplay}</p>
      </div>
    </div>
  );
};