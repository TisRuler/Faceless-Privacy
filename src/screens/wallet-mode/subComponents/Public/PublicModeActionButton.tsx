import React from "react";
import { TXIDVersion } from "@railgun-community/shared-models";
import { SendableToken } from "~~/src/shared/types";
import { ChainData } from "~~/src/config/chains/types";
import { usePublicModeAction } from "../../hooks/usePublicModeAction";
import { WalletCardActionButton } from "../Shared/WalletCardActionButton";

interface PublicModeActionButtonProps {
  activeNetwork: ChainData;
  txIDVersion: TXIDVersion.V2_PoseidonMerkle;
  tokenToSend: SendableToken;
  amount: string;
  recipientAddress: string;
  gasChoiceDefault: boolean;
  customGweiAmount: number;
  isTransactionInProgress: boolean;
}

export const PublicModeActionButton: React.FC<PublicModeActionButtonProps> = ({
  activeNetwork,
  txIDVersion,
  tokenToSend,
  amount,
  recipientAddress,
  gasChoiceDefault,
  customGweiAmount,
  isTransactionInProgress,
}) => {

  const { publicModeButtonText, handlePublicModeAction } = usePublicModeAction({
    activeNetwork,
    tokenToSend, 
    txIDVersion, 
    amount, 
    recipientAddress, 
    gasChoiceDefault, 
    customGweiAmount
  });
    
  return (
    <WalletCardActionButton text={publicModeButtonText} isButtonDisabled={isTransactionInProgress} handleAction={handlePublicModeAction}/>
  );
};