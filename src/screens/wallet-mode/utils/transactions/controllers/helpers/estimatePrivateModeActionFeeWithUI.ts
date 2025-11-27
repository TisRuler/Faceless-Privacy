import { PrivateModeButtonState } from "../../../enums";
import { getNotificationFromError } from "~~/src/shared/utils/other/getNotificationFromError";
import { SharedEstimateParams } from "~~/src/screens/wallet-mode/types";
import { logError } from "~~/src/shared/utils/other/logError";
import { useWalletModeScreenStore } from "~~/src/state-managers";
import { processBroadcasterError } from "~~/src/shared/utils/broadcaster";
import toast from "react-hot-toast";

const setPrivateModeTxHash = useWalletModeScreenStore.getState().setPrivateModeTxHash;

// Wraps logic to incororporate
export const estimatePrivateModeActionFeeWithUI = async <T>(
  options: {
    sharedPrivateModeEstimateParams: SharedEstimateParams;
    logicFunction: () => Promise<T>;
    onSuccess: (result: T) => void;
  }
) => {
  const { sharedPrivateModeEstimateParams, logicFunction, onSuccess } = options;
  const { corePrivateModeActionParams } = sharedPrivateModeEstimateParams;

  setPrivateModeTxHash("");
  corePrivateModeActionParams.setPrivateModeActionButtonText(PrivateModeButtonState.Estimating);
  corePrivateModeActionParams.setIsTransactionInProgress(true);

  try {
    const result = await logicFunction();
    onSuccess(result);

    toast.success("Fee Estimated");
    corePrivateModeActionParams.setPrivateModeActionButtonText(PrivateModeButtonState.ReadyToWithdraw);
    corePrivateModeActionParams.setIsTransactionInProgress(false);
  } catch (error) {
    logError(error);
    processBroadcasterError(error);
    corePrivateModeActionParams.resetActionState();
    toast.error(getNotificationFromError(error));
  }
};
