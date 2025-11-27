import { shieldTokenLogic } from "../../coreLogic/public/shieldTokenLogic";
import { validateReceiverAddress, validateAmount } from "../../coreLogic/helper";
import { useWalletModeScreenStore } from "~~/src/state-managers";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { PublicModeButtonState } from "../../../enums";
import { getNotificationFromError } from "~~/src/shared/utils/other/getNotificationFromError";
import { TXIDVersion } from "@railgun-community/shared-models";
import { NetworkName } from "@railgun-community/shared-models";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { isTokenApproved, approveTokenWithFallback, getPublicWalletData } from "../../proccessors";
import { logError } from "~~/src/shared/utils/other/logError";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";
import { handleTxConfirmationNotifications } from "../helpers/handleTxConfirmationNotifications";
import { FallbackProvider, JsonRpcProvider } from "ethers";
import toast from "react-hot-toast";

type ShieldTokenUIProps = {
  provider: JsonRpcProvider | FallbackProvider;
  networkName: NetworkName;
  txIDVersion: TXIDVersion.V2_PoseidonMerkle
  tokenAddress: string;
  amount: string;
  recipientAddress: string;
  gasChoiceDefault: boolean;
  customGweiAmount: number;
  setPublicModeButtonText: React.Dispatch<React.SetStateAction<string>>;
};

const setPublicModeTxHash = useWalletModeScreenStore.getState().setPublicModeTxHash;
const setIsTransactionInProgress = useWalletModeScreenStore.getState().setIsTransactionInProgress;

/*
  Logic + Ui.
  shieldToken first checks if the token is already approved.
  If approved, it proceeds to execute shieldTokenLogic.

  If not, it attempts to call `increaseAllowance`.
  If the token contract doesn't support it (typical of old ERC-20s),
  the call fails and triggers a fallback: reset allowance to 0, then issue a new `approve`.

  This fallback ensures compatibility, but costs an extra transaction.
*/
export async function shieldToken({
  provider,
  networkName,
  txIDVersion,
  tokenAddress,
  amount,
  recipientAddress,
  gasChoiceDefault,
  customGweiAmount,
  setPublicModeButtonText,
}: ShieldTokenUIProps) {
  const { id: chainId, anonymityPoolAddress } = getActiveNetwork();

  setPublicModeTxHash("");
  setIsTransactionInProgress(true);

  try {

    validateAmount(amount);
    validateReceiverAddress(recipientAddress, true);

    setPublicModeButtonText(PublicModeButtonState.WaitingForConfirmation);
    toast.success(WALLET_MODE_NOTIFICATIONS.ADDED_RAILGUN_FEE, {duration: 8000});

    const { publicAddress, publicWalletSigner, shieldPrivateKey } = await getPublicWalletData();
    
    const isTokenApprovedResult = await isTokenApproved(
      tokenAddress, 
      publicAddress, 
      amount, 
      anonymityPoolAddress, 
      chainId
    );

    if (!isTokenApprovedResult) {
      try {

        await approveTokenWithFallback(
          provider,
          tokenAddress, 
          publicAddress, 
          amount, 
          anonymityPoolAddress, 
          publicWalletSigner, 
          chainId, 
          setPublicModeButtonText
        );

        toast.success(WALLET_MODE_NOTIFICATIONS.TOKEN_APPROVED);
        setPublicModeButtonText(PublicModeButtonState.WaitingForConfirmation);
      } catch (error) {
        throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.TOKEN_APPROVAL_ERROR, error);
      }
    }

    const txHash = await shieldTokenLogic({
      provider,
      network: networkName,
      txIDVersion,
      tokenAddress,
      amount,
      recipientAddress,
      publicAddress, 
      publicWalletSigner, 
      shieldPrivateKey,
      gasChoiceDefault,
      customGweiAmount,
    });

    setPublicModeButtonText(PublicModeButtonState.Sending);
    
    setPublicModeTxHash(txHash);
    await handleTxConfirmationNotifications(provider, txHash);

    setPublicModeButtonText(PublicModeButtonState.Send);
  } catch (error) {
    toast.error(getNotificationFromError(error));
    setPublicModeButtonText(PublicModeButtonState.Send);
    logError(error);
  } finally {
    setIsTransactionInProgress(false);
  }
};