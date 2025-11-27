import { PublicModeButtonState } from "../../../enums";
import { approveToken } from "./approveToken";
import { resetTokenApproval } from "./resetTokenApproval";
import { isUserRejectionError } from "~~/src/shared/utils/other/isUserRejectionError";
import { FallbackProvider, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { SupportedChainId } from "~~/src/shared/types";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";

/*
  shieldToken first checks if the token is already approved.
  If approved, it proceeds to execute shieldTokenLogic.

  If not, it attempts to call `increaseAllowance`.
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
    await performApproval(
      provider,
      tokenAddress,
      publicAddress,
      amount,
      anonymityPoolAddress,
      publicWalletSigner,
      chainId,
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

    await performApproval(
      provider,
      tokenAddress,
      publicAddress,
      amount,
      anonymityPoolAddress,
      publicWalletSigner,
      chainId,
      setPublicModeButtonText
    );
  }
};
  
// Helper
async function performApproval(
  provider: FallbackProvider | JsonRpcProvider,
  tokenAddress: string,
  publicAddress: string,
  amount: string,
  anonymityPoolAddress: string,
  signer: JsonRpcSigner, 
  chainId: SupportedChainId,
  setPublicModeButtonText?: React.Dispatch<React.SetStateAction<string>>,
) {
  setPublicModeButtonText?.(PublicModeButtonState.WaitingForConfirmation);
  const approvalTx = await approveToken(
    tokenAddress,
    publicAddress,
    amount,
    anonymityPoolAddress,
    signer,
    chainId,
  );
  setPublicModeButtonText?.(PublicModeButtonState.Approving);
  const receipt = await provider.waitForTransaction(approvalTx.hash);
    
  if (!receipt || receipt.status !== 1) throw new Error("increaseAllowance tx failed");
};