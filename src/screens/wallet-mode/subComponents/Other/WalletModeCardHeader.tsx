import React from "react";
import { CardView } from "~~/src/shared/enums";
import { CopyAddressToClipboard } from "~~/src/layouts/Modals/shared/components";
import { EthereumSepoliaData } from "~~/src/config/chains";
import { validateEthAddress, validateRailgunAddress } from "@railgun-community/wallet";
import { useConnectorRolesStore } from "~~/src/state-managers";

// Title and Subtitle JSX
const Title: React.FC<{ text: string }> = ({ text }) => (
  <p className="w-full cursor-default text-center font-isb text-2xl text-main-base">{text}</p>
);

const Subtitle: React.FC<{ text: string }> = ({ text }) => (
  <p className="w-full cursor-default text-center font-im text-main-100">{text}</p>
);

const centerClass = "flex flex-col items-center text-center mb-2 w-[19.75rem]"; // fixed width

interface WalletModeCardHeaderProps {
  walletModeCardView: CardView;
  yourPrivateAddress: string;
  yourPublicAddress?: string;
}

// Main component
export const WalletModeCardHeader: React.FC<WalletModeCardHeaderProps> = ({ walletModeCardView, yourPrivateAddress, yourPublicAddress }) => {

  const isPrivateConnected = validateRailgunAddress(yourPrivateAddress);

  const isPublicAddressConnected = yourPublicAddress ? validateEthAddress(yourPublicAddress) : false;
  const isPublicConnectorIdActive = useConnectorRolesStore((store) => store.publicConnectorId);
  const isPublicConnected = isPublicAddressConnected && isPublicConnectorIdActive;

  const isPublicView = walletModeCardView === CardView.Public;
  const isConnected = isPublicView ? isPublicConnected : isPrivateConnected;
  
  const address = isPublicView ? yourPublicAddress : yourPrivateAddress;
  const titleText = isPublicView ? "Send From Public Address" : "Send From Private Address";
  const subtitleText = isPublicView ? "Make your tokens Private" : "These tokens are Private";

  return (
    <div className={centerClass}>
      <Title text={titleText} />
      {isConnected && address ? (
        <CopyAddressToClipboard network={EthereumSepoliaData} address={address} colourClass="text-main-200" />
      ) : (
        <Subtitle text={subtitleText} />
      )}
    </div>
  );
};
