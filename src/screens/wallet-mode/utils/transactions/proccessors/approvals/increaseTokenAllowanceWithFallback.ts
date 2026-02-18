import { PublicModeButtonState } from "../../../enums";
import { approveToken, increaseTokenAllowance, resetTokenApproval } from "./";
import { isUserRejectionError } from "~~/src/shared/utils/other/isUserRejectionError";
import { FallbackProvider, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { SupportedChainId } from "~~/src/shared/types";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";

/*
  shieldToken first checks if the token is already approved.
  If approved, it proceeds to execute shieldTokenLogic.

  If not, it attempts to call `increaseTokenAllowance`.
  If the token contract doesn't support it (typical of poorly implemented ERC-20s),
  the call fails and triggers a fallback: reset allowance to 0, then issue a new `approve`.

  This fallback ensures compatibility, but costs an extra transaction.
*/

export async function approveTokenWithFallback(
  provider: FallbackProvider | JsonRpcProvider,
  tokenAddress: string,
  publicAddress: string,
  amount: string,
  anonymityPoolAddress: string,
  publicWalletSigner: JsonRpcSigner,
  chainId: SupportedChainId,
  setPublicModeButtonText?: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> {

  try {
    // Increase token allowance
    await performActionWithUi(
      provider,
      () => increaseTokenAllowance(
        tokenAddress,
        publicAddress,
        amount,
        anonymityPoolAddress,
        publicWalletSigner,
        chainId,
      ),
      "increaseTokenAllowance tx failed",
      setPublicModeButtonText
    );
  } catch (error) {
    if (isUserRejectionError(error)) throwErrorWithTitle(GENERAL_NOTIFICATIONS.USER_REJECTION, error);

    // Fallback approval flow
    setPublicModeButtonText?.(PublicModeButtonState.WaitingForConfirmation);

    const resetTx = await resetTokenApproval(
      tokenAddress,
      anonymityPoolAddress,
      publicWalletSigner
    );

    setPublicModeButtonText?.(PublicModeButtonState.Approving);

    const receipt = await provider.waitForTransaction(resetTx.hash);
    if (!receipt || receipt.status !== 1) {
      throw new Error("increaseAllowance tx failed");
    };

    // Approve token
    await performActionWithUi(
      provider,
      () => approveToken(
        tokenAddress,
        amount,
        anonymityPoolAddress,
        publicWalletSigner,
        chainId,
      ),
      "approveToken tx failed",
      setPublicModeButtonText
    );
  }
};
  
// Main
async function performActionWithUi(
  provider: FallbackProvider | JsonRpcProvider,
  action: () => Promise<any>,
  backupErrorMessage: string,
  setPublicModeButtonText?: React.Dispatch<React.SetStateAction<string>>,
) {
  setPublicModeButtonText?.(PublicModeButtonState.WaitingForConfirmation);
  const actionTx = await action();
  setPublicModeButtonText?.(PublicModeButtonState.Approving);
  const receipt = await provider.waitForTransaction(actionTx.hash);
    
  if (!receipt || receipt.status !== 1) throw new Error(backupErrorMessage);
};