import { ChainData } from "~~/src/config/chains/types";
import { CardView, PrivateModeDestination, PublicModeDestination } from "~~/src/shared/enums";
import { useWalletModeScreenStore } from "~~/src/state-managers";
import { useIsMobile } from "~~/src/shared/hooks/useIsMobile";

interface WalletActionExplanationProps {
  activeNetwork: ChainData;
  walletModeCardView: CardView;
};
  
export const WalletActionExplanation: React.FC<WalletActionExplanationProps> = ({
  activeNetwork,
  walletModeCardView,
}) => {

  // Subscriptions
  const feeDataToDisplay = useWalletModeScreenStore((store => store.feeDataToDisplay));
  const tokenForPrivateMode = useWalletModeScreenStore((store => store.tokenForPrivateMode));
  const privateModeDestination = useWalletModeScreenStore((store) => store.privateModeDestination);
  const publicModeDestination = useWalletModeScreenStore((store) => store.publicModeDestination);

  // Flags
  const isUsingMobile = useIsMobile();
  const isBaseToken = tokenForPrivateMode.address === activeNetwork.privateModeBaseToken.address;
  const isViewingPrivateAddress = walletModeCardView === CardView.Private;
  const isToPublicAddress = privateModeDestination === PrivateModeDestination.PublicAddress;
  const isToLinkSendersAddress = 
    (privateModeDestination === PrivateModeDestination.LinkSendersAddress && isViewingPrivateAddress) || 
    (publicModeDestination === PublicModeDestination.LinkSendersAddress && !isViewingPrivateAddress);

  // - Display or hide text booleans
  const displayAutoUnwrapText = isToPublicAddress && isBaseToken && feeDataToDisplay;
  const displayDesktopReliabilityText = !displayAutoUnwrapText && isUsingMobile && isViewingPrivateAddress;
  const displayPaymentLinkText = !displayAutoUnwrapText && !displayDesktopReliabilityText && isToLinkSendersAddress;

  if (!displayAutoUnwrapText && !displayDesktopReliabilityText && !displayPaymentLinkText) return null;
    
  // Text and style
  const textToDisplay = displayAutoUnwrapText ? 
    (`Auto-converted to ${activeNetwork.publicModeBaseToken.symbol} for the recipient`) : 
    displayPaymentLinkText ? ("Only trust this address if the donation receiver sent the link") :
    ("Transactions are more reliable on desktop");

  const containerClasses = "fixed top-[7.5rem] sm:top-[5.125rem] left-0 right-0 z-[1] flex justify-center m-2";
  const cardClasses = "rounded-2xl flex items-center font-im cursor-pointer whitespace-nowrap";
  const borderClasses = "border border-[#B8FFAD]";
  const paddingClasses = "px-3 py-1";
  const textClasses = `${displayPaymentLinkText ? "text-xs" : "text-sm"} sm:text-base font-isb sm:font-im text-white`;

  return (
    <div className={containerClasses}>
      <div className={`${cardClasses} ${borderClasses} ${paddingClasses}`}>
        <p className={textClasses}>{textToDisplay}</p>
      </div>
    </div>
  );
};