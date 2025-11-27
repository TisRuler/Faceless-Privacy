import { Contract, JsonRpcSigner } from "ethers";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import ERC20Abi from "~~/src/assets/abis/ERCAbi.json";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";

export const resetTokenApproval = async (
  tokenAddress: string,
  anonymityPoolAddress: string,
  publicWalletSigner: JsonRpcSigner,
) => {
  try {

    const tokenContractWithSigner = new Contract(tokenAddress, ERC20Abi, publicWalletSigner);

    const resetTx = await tokenContractWithSigner.approve(anonymityPoolAddress, 0n);

    return resetTx;

  } catch (error: any) {
    throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.TOKEN_APPROVAL_ERROR, error);
  }
};