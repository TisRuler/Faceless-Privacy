import { useState, useEffect } from "react";
import { TXIDVersion } from "@railgun-community/shared-models";
import { PublicModeButtonState } from "../utils/enums";
import { PublicModeDestination } from "~~/src/shared/enums";
import { ensureWalletConnectorReady } from "~~/src/shared/utils/wallet";
import { openPublicModeConnectionGateModal } from "~~/src/layouts/Modals/modalUtils";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { 
  useSettingsStore, 
  usePrivateAddressStore, 
  useWalletModeScreenStore, 
  useConnectorRolesStore, 
  ConnectorRoles 
} from "~~/src/state-managers";
import { useAccount } from "wagmi";
import { getEthersProvider } from "~~/src/shared/utils/network";
import { 
  sendPublicToken, 
  shieldToken, 
  sendPublicBaseToken, 
  shieldBaseToken 
} from "../utils/transactions/controllers/public";
import { getAmountWithRailgunFee } from "../utils/transactions/coreLogic/helper/getAmountWithRailgunFee";
import { ChainData } from "~~/src/config/chains/types";
import { SendableToken } from "~~/src/shared/types";

 interface usePublicModeActionParams {
  activeNetwork: ChainData,
  tokenToSend: SendableToken,
  txIDVersion: TXIDVersion.V2_PoseidonMerkle;
  amount: string;
  recipientAddress: string;
  gasChoiceDefault: boolean;
  customGweiAmount: number;
}

// Main
export function usePublicModeAction({
  activeNetwork,
  tokenToSend,
  txIDVersion,
  amount,
  recipientAddress,
  gasChoiceDefault,
  customGweiAmount,
}: usePublicModeActionParams) {

  const isSendingBaseToken = tokenToSend?.isBaseToken === true;
    
  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();

  const publicConnectorId = useConnectorRolesStore((store) => store.publicConnectorId);
  const isMissingPublicConnectorId = !publicConnectorId;
  const { isConnected: isAnyWalletActive } = useAccount();

  const publicModeDestination = useWalletModeScreenStore((store) => store.publicModeDestination);
  const yourPrivateAddress = usePrivateAddressStore((store) => store.yourPrivateAddress);

  const isToYourPrivateAddress = publicModeDestination === PublicModeDestination.ConnectedPrivateAddress;
  const isToOtherUsersPublicAddress = publicModeDestination === PublicModeDestination.OtherPublicAddress;

  // Button text
  const getButtonText = () => {
    let text;
    if (isMissingPublicConnectorId && isToYourPrivateAddress) {
      text = PublicModeButtonState.ConnectWallet;
    } else if (isMissingPublicConnectorId || !isAnyWalletActive) {
      text = PublicModeButtonState.ConnectWallet;
    } else if (!yourPrivateAddress && isToYourPrivateAddress) {
      text = PublicModeButtonState.ConnectPrivateAddress;
    } else {
      text = PublicModeButtonState.Send;
    }

    return text;
  };

  // - MAIN BUTTON TEXT
  const [publicModeButtonText, setPublicModeButtonText] = useState<string>(getButtonText());

  useEffect(() => { // Text updater
    setPublicModeButtonText(getButtonText());
  }, [publicConnectorId, isAnyWalletActive, publicModeDestination, yourPrivateAddress]);
      
  useEffect(() => { // Update isNonModalWalletActionRequired (flag for blocking parts of the Ui)
    const setIsNonModalWalletActionRequired = useWalletModeScreenStore.getState().setIsNonModalWalletActionRequired;
    
    let isRequired;
    if (publicModeButtonText === PublicModeButtonState.WaitingForConfirmation) {
      isRequired = true;
    } else {
      isRequired = false;
    }
    
    setIsNonModalWalletActionRequired(isRequired);
  }, [publicModeButtonText]);

  // Main Function
  const handlePublicModeAction = async () => {
    const isTransactionInProgress = useWalletModeScreenStore.getState().isTransactionInProgress;
    if (isTransactionInProgress) return;
    
    const wagmiConfig = useSettingsStore.getState().wagmiConfig;

    const provider = getEthersProvider();

    const isPublicConnectorReady = await ensureWalletConnectorReady({
      activeNetwork,
      wagmiConfig,
      shouldBootstrapNetworkStack,
      targetConnectorId: publicConnectorId,
      targetRole: ConnectorRoles.PUBLIC,
      displayConnect: () => openPublicModeConnectionGateModal(),
    });

    if (!isPublicConnectorReady) return;

    if (isToYourPrivateAddress && !yourPrivateAddress) {
      openPublicModeConnectionGateModal();
      return;
    }

    const amountWithRailgunWithFee = await getAmountWithRailgunFee(
      isToOtherUsersPublicAddress, 
      amount, 
      tokenToSend
    );

    if (isToOtherUsersPublicAddress) {

      if (isSendingBaseToken) {
        sendPublicBaseToken({
          provider,
          amount: amountWithRailgunWithFee, 
          receiver: recipientAddress, 
          gasChoiceDefault, 
          customGweiAmount, 
          setPublicModeButtonText
        });
      } else {
        sendPublicToken({
          provider, 
          tokenAddress: tokenToSend.address,
          amount: amountWithRailgunWithFee, 
          receiver: recipientAddress, 
          gasChoiceDefault, 
          customGweiAmount, 
          setPublicModeButtonText
        });
      };

    } else { // Sending to private address

      if (isSendingBaseToken) {
        shieldBaseToken({
          provider, 
          networkName: activeNetwork.railgunNetworkName, 
          txIDVersion, 
          amount: amountWithRailgunWithFee, 
          recipientAddress, 
          gasChoiceDefault, 
          customGweiAmount, 
          setPublicModeButtonText
        });
      } else {
        shieldToken({
          provider,
          networkName: activeNetwork.railgunNetworkName,
          txIDVersion,
          tokenAddress: tokenToSend.address,
          amount: amountWithRailgunWithFee,
          recipientAddress,
          gasChoiceDefault,
          customGweiAmount,
          setPublicModeButtonText,
        });
      };

    }
  };

  return {
    publicModeButtonText,
    handlePublicModeAction,
  };
}