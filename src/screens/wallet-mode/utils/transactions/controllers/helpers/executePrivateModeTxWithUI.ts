import { PrivateModeButtonState } from "../../../enums";
import { getNotificationFromError } from "~~/src/shared/utils/other/getNotificationFromError";
import { SharedSubmitParams } from "~~/src/screens/wallet-mode/types";
import { useWalletModeScreenStore } from "~~/src/state-managers";
import { logError } from "~~/src/shared/utils/other/logError";
import { handleTxConfirmationNotifications } from "./handleTxConfirmationNotifications";
import { processBroadcasterError } from "~~/src/shared/utils/broadcaster";
import toast from "react-hot-toast";

const setPrivateModeTxHash = useWalletModeScreenStore.getState().setPrivateModeTxHash;

export const executePrivateModeTxWithUI = async (
  sharedSubmitParams: SharedSubmitParams,
  logicFunction: () => Promise<string>,
) => {

  const { corePrivateModeActionParams, provider } = sharedSubmitParams;

  corePrivateModeActionParams.setIsTransactionInProgress(true);
  corePrivateModeActionParams.setPrivateModeActionButtonText(PrivateModeButtonState.Withdrawing);

  try {
    // Send tx and get hash
    const txHash = await logicFunction();
    setPrivateModeTxHash(txHash);

    await handleTxConfirmationNotifications(provider, txHash);

    corePrivateModeActionParams.resetActionState();

  } catch (error) {
    logError(error);
    processBroadcasterError(error);
    corePrivateModeActionParams.resetActionState();
    toast.error(getNotificationFromError(error));
  }
};
