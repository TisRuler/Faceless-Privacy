import React from "react";
import { TXIDVersion } from "@railgun-community/shared-models";
import { PrivateModeDestination } from "~~/src/shared/enums";
import { FeeDataToDisplay } from "~~/src/screens/wallet-mode/types";
import { ChainData } from "~~/src/config/chains/types";
import { usePrivateModeAction } from "../../hooks/usePrivateModeAction";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { openPrivateModeConnectionGate } from "~~/src/layouts/Modals/modalUtils";
import { useConnectorRolesStore } from "~~/src/state-managers";
import { WalletCardActionButton } from "../Shared/WalletCardActionButton";
import { SendableToken } from "~~/src/shared/types";

interface PrivateModeActionButtonProps {
  txIDVersion: TXIDVersion.V2_PoseidonMerkle;
  activeNetwork: ChainData;
  isTransactionInProgress: boolean;
  tokenToSend: SendableToken;
  recipientAddress: string;
  amount: string;
  privateModeDestination: PrivateModeDestination;
  yourPrivateAddress: string;
  feeDataToDisplay: FeeDataToDisplay;
  setFeeDataToDisplay: (value: FeeDataToDisplay) => void,
};

export const PrivateModeActionButton: React.FC<PrivateModeActionButtonProps> = ({ 
  txIDVersion,
  activeNetwork,
  isTransactionInProgress,
  tokenToSend,
  recipientAddress,
  amount,
  privateModeDestination,
  yourPrivateAddress,
  feeDataToDisplay,
  setFeeDataToDisplay,
}) => {

  const { 
    handlePrivateModeAction, 
    privateModeActionButtonText, 
    isPrivateAddressConnected,
    isUsingSelfSignMethod
  } = usePrivateModeAction({
    txIDVersion,
    activeNetwork,
    yourPrivateAddress,
    recipientAddress,
    amount,
    tokenToSend,
    privateModeDestination,
    feeDataToDisplay,
    setFeeDataToDisplay,
  });

  const shouldConnectProvider = useShouldBootstrapNetworkStack();
  const selfSigningConnectorId = useConnectorRolesStore((store) => store.selfSigningConnectorId);
  const shouldConnectSelfSigningConnector = isUsingSelfSignMethod && !selfSigningConnectorId;

  const additionalConnectionNeeded = !isPrivateAddressConnected || shouldConnectProvider || shouldConnectSelfSigningConnector;

  const handleClick = additionalConnectionNeeded ? openPrivateModeConnectionGate : handlePrivateModeAction;

  return (
    <WalletCardActionButton text={privateModeActionButtonText} isButtonDisabled={isTransactionInProgress} handleAction={handleClick}/>
  );
};