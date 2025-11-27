import { useState, useEffect } from "react";
import { FeeDataToDisplay } from "../types";
import { getMemoWithTimestamp } from "../utils/transactions/coreLogic/helper";
import { PrivateModeDestination } from "~~/src/shared/enums";
import { DataForBaseTokenSubmission, DataForPrivateModeTxSubmission } from "../types";
import { useSettingsStore, usePrivateAddressStore, useWalletModeScreenStore, useBroadcasterStore } from "~~/src/state-managers";
import { useBroadcasterMethodStatus } from "~~/src/shared/hooks/useBroadcasterMethodStatus";
import { PrivateModeButtonState } from "../utils/enums";
import { TXIDVersion } from "@railgun-community/shared-models";
import { useAccount } from "wagmi";
import { getEthersProvider } from "~~/src/shared/utils/network";
import { 
  estimateUnshieldTokens, 
  estimateUnshieldBaseToken, 
  estimatePrivateTokenTransfer, 
  submitUnshieldTokens, 
  submitUnshieldBaseToken, 
  submitTransferTokens 
} from "../utils/transactions/controllers/private";
import { getAmountWithRailgunFee } from "../utils/transactions/coreLogic/helper/getAmountWithRailgunFee";
import { ChainData } from "~~/src/config/chains/types";
import { SendableToken } from "~~/src/shared/types";

interface UsePrivateModeActionParams {
  txIDVersion: TXIDVersion.V2_PoseidonMerkle,
  activeNetwork: ChainData,
  yourPrivateAddress: string,
  recipientAddress: string,
  amount: string,
  tokenToSend: SendableToken,
  privateModeDestination: PrivateModeDestination,
  feeDataToDisplay: FeeDataToDisplay,
  setFeeDataToDisplay: (value: FeeDataToDisplay) => void,
}

const setIsTransactionInProgress = useWalletModeScreenStore.getState().setIsTransactionInProgress;

export function usePrivateModeAction({
  txIDVersion,
  activeNetwork,
  yourPrivateAddress,
  recipientAddress,
  amount,
  tokenToSend,
  privateModeDestination,
  feeDataToDisplay,
  setFeeDataToDisplay,
}: UsePrivateModeActionParams) {

  // Get details
  const { privateModeBaseToken, railgunNetworkName, railgunChain } = activeNetwork;
  const provider = getEthersProvider();

  const {
    gasChoiceDefault,
    customGweiAmount,
  } = useSettingsStore();

  const { isUsingSelfSignMethod } = useBroadcasterMethodStatus();
  const broadcasterFeeToken = useBroadcasterStore((store) => store.broadcasterFeeToken);

  const railgunWalletId = usePrivateAddressStore((state) => state.railgunWalletId);

  const isPrivateAddressConnected = Boolean(yourPrivateAddress);
  const { isConnected: isPublicWalletConnected } = useAccount();
  const doesPublicWalletNeedConnecting = !isPublicWalletConnected && isUsingSelfSignMethod;

  // Button text
  const getButtonState = () => {
    let newButtonState = PrivateModeButtonState.ReadyToEstimate;

    if (!isPrivateAddressConnected) {
      newButtonState = PrivateModeButtonState.ConnectPrivateAddress;
    } else if (feeDataToDisplay === undefined) {
      newButtonState = PrivateModeButtonState.ReadyToEstimate;
    }

    return newButtonState;
  };

  // - MAIN BUTTON TEXT
  const [privateModeActionButtonText, setPrivateModeActionButtonText] = useState<string>(getButtonState());

  useEffect(() => { // Text updater
    setPrivateModeActionButtonText(getButtonState());
  }, [
    yourPrivateAddress,
    feeDataToDisplay,
  ]);

  // Helper function
  const resetActionState = () => {
    setPrivateModeActionButtonText(PrivateModeButtonState.ReadyToEstimate);
    setFeeDataToDisplay(undefined);
    setIsTransactionInProgress(false);
  };
  
  // Routers
  const needsEstimation = !feeDataToDisplay;
  const isDestinationPublicAddress = privateModeDestination === PrivateModeDestination.PublicAddress;
  const isDestinationPrivateAddress = privateModeDestination === PrivateModeDestination.PrivateAddress;
  const isWithdrawingBaseToken = tokenToSend.address === privateModeBaseToken.address;

  // Params
  const memoText = getMemoWithTimestamp(yourPrivateAddress);
  const showSenderAddressToRecipient = false;

  const progressCallback = (progress: number) => {
    // Do nothing - the progress is quick in these tx's
  };
  
  const corePrivateModeActionParams = { 
    network: railgunNetworkName, 
    txIDVersion, 
    railgunWalletId, 
    isUsingSelfSignMethod, 
    setIsTransactionInProgress, 
    setPrivateModeActionButtonText, 
    resetActionState 
  };
  
  const sharedSubmitParams = { 
    corePrivateModeActionParams, 
    railgunChain, 
    progressCallback, 
    provider
  };
  
  const sharedPrivateModeEstimateParams = () => { 
    return {
      corePrivateModeActionParams, 
      broadcasterFeeToken, 
      recipientAddress, 
      amount: getAmountWithRailgunFee(
        isDestinationPrivateAddress, 
        amount, 
        tokenToSend
      ), 
      gasChoiceDefault, 
      customGweiAmount
    };
  };
  
  const [dataForBaseTokenSubmission, setDataForBaseTokenSubmission] = useState<DataForBaseTokenSubmission>({
    transactionGasDetails: undefined,
    selectedBroadcaster: undefined,
    broadcasterFeeRaw: undefined,
    baseTokenAmount: undefined,
  });
  
  const [dataForPrivateModeTxSubmission, setDataForPrivateModeTxSubmission] = useState<DataForPrivateModeTxSubmission>({
    transactionGasDetails: undefined,
    selectedBroadcaster: undefined,
    broadcasterFeeRaw: undefined,
    erc20AmountRecipients: undefined,
    broadcasterFeeERC20AmountRecipient: undefined,
  });

  // Main handlers
  const handlePrivateModeActionToPublicAddress = async () => {
    
    if (isWithdrawingBaseToken) {
      if (needsEstimation) {
        estimateUnshieldBaseToken({
          sharedPrivateModeEstimateParams: sharedPrivateModeEstimateParams(),
          setDataForBaseTokenSubmission,
          setFeeDataToDisplay,
        });
      } else {
        submitUnshieldBaseToken({
          sharedSubmitParams,
          recipientAddress,
          dataForBaseTokenSubmission,
        });
      }
    } else {
      if (needsEstimation) {
        estimateUnshieldTokens({
          sharedPrivateModeEstimateParams: sharedPrivateModeEstimateParams(),
          tokenToSend,
          setDataForPrivateModeTxSubmission,
          setFeeDataToDisplay,
        });
      } else {
        submitUnshieldTokens({
          sharedSubmitParams,
          dataForPrivateModeTxSubmission,
        });
      }
    }
  };
  
  const handleTransferToPrivateAddress = () => {
    if (needsEstimation) {
      estimatePrivateTokenTransfer({
        sharedPrivateModeEstimateParams: sharedPrivateModeEstimateParams(),
        tokenToSend,
        memoText,
        setDataForPrivateModeTxSubmission,
        setFeeDataToDisplay,
      });
    } else {
      submitTransferTokens({
        sharedSubmitParams,
        memoText,
        showSenderAddressToRecipient,
        dataForPrivateModeTxSubmission,
      });
    }
  };

  // Main function
  const handlePrivateModeAction = async () => {
    const isTransactionInProgress = useWalletModeScreenStore.getState().isTransactionInProgress;
    if (isTransactionInProgress) return;

    if (isDestinationPublicAddress) {
      handlePrivateModeActionToPublicAddress();
    } else {
      handleTransferToPrivateAddress();
    }
  };

  return { 
    handlePrivateModeAction, 
    privateModeActionButtonText, 
    isPrivateAddressConnected,
    isPublicWalletConnected, 
    doesPublicWalletNeedConnecting,
    isUsingSelfSignMethod
  };
}