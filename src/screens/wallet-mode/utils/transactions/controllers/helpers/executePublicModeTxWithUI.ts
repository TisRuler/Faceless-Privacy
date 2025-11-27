import { getNotificationFromError } from "~~/src/shared/utils/other/getNotificationFromError";
import { useWalletModeScreenStore } from "~~/src/state-managers";
import { PublicModeButtonState } from "../../../enums";
import { FallbackProvider, JsonRpcProvider } from "ethers";
import { handleTxConfirmationNotifications } from "./handleTxConfirmationNotifications";
import { logError } from "~~/src/shared/utils/other/logError";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import toast from "react-hot-toast";

const setPublicModeTxHash = useWalletModeScreenStore.getState().setPublicModeTxHash;
const setIsTransactionInProgress = useWalletModeScreenStore.getState().setIsTransactionInProgress;

type ExecutePublicModeTxWithUIProps = {
  provider: JsonRpcProvider | FallbackProvider;
  setPublicModeButtonText: React.Dispatch<React.SetStateAction<string>>;
  sendLogic: () => Promise<string>;
};

/**
 * Reusable UI wrapper where the logic function is already bound with its arguments.
 */
export async function executePublicModeTxWithUI({
  provider,
  setPublicModeButtonText,
  sendLogic,
}: ExecutePublicModeTxWithUIProps) {
  setPublicModeTxHash("");
  setIsTransactionInProgress(true);
  setPublicModeButtonText(PublicModeButtonState.WaitingForConfirmation);
  toast.success(WALLET_MODE_NOTIFICATIONS.ADDED_RAILGUN_FEE, {duration: 8000});

  try {
    const txHash = await sendLogic();

    setPublicModeButtonText(PublicModeButtonState.Sending);
    setPublicModeTxHash(txHash);

    await handleTxConfirmationNotifications(provider, txHash);

    setPublicModeButtonText(PublicModeButtonState.Send);
  } catch (error) {
    logError(error);
    toast.error(getNotificationFromError(error));
    setPublicModeButtonText(PublicModeButtonState.Send);
  } finally {
    setIsTransactionInProgress(false);
  }
}
