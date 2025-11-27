import { toast } from "react-hot-toast";
import { Provider, FallbackProvider } from "ethers";
import { useUiStore } from "~~/src/state-managers";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other";

const triggerTxCelebration = useUiStore.getState().triggerTxCelebration;

export async function handleTxConfirmationNotifications(
  provider: Provider | FallbackProvider,
  txHash: string,
) {
  toast.success(WALLET_MODE_NOTIFICATIONS.FUNDS_IN_TRANSIT, { duration: 6000 });
  try {
    const receipt = await provider.waitForTransaction(txHash);

    if (receipt?.status === 1) {
      toast.success(WALLET_MODE_NOTIFICATIONS.TX_SUCCESS, { duration: 10000 });
      triggerTxCelebration();
    } else {
      toast.error(WALLET_MODE_NOTIFICATIONS.TX_FAILED, { duration: 10000 });
    }
  } catch (error) {
    toast.error(WALLET_MODE_NOTIFICATIONS.TX_FAILED, { duration: 10000 });
    throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.TX_FAILED, error);
  }
}
