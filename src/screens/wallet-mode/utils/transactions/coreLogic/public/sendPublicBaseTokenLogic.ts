import { ethers, FallbackProvider, JsonRpcProvider } from "ethers";
import { validateAmount } from "../helper/validateAmount";
import { validateReceiverAddress } from "../helper/validateReceiverAddress";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { enforceAccountSwitch, getPublicWalletSigner } from "~~/src/shared/utils/wallet";
import { ConnectorRoles } from "~~/src/state-managers/connectorRolesStore";
import { getBaseGasFees } from "../../proccessors";

type SendBaseTokenParams = {
  amount: string;
  receiver: string;
  gasChoiceDefault: boolean;
  customGweiAmount: number;
  provider: FallbackProvider | JsonRpcProvider,
};

export async function sendPublicBaseTokenLogic({
  amount,
  receiver,
  gasChoiceDefault,
  customGweiAmount,
  provider,
}: SendBaseTokenParams) {
  
  validateAmount(amount);
  validateReceiverAddress(receiver, false);

  const { id: chainId, supportsEIP1559 } = getActiveNetwork();

  const publicWalletSigner = await getPublicWalletSigner();

  // parse human-readable ETH to wei
  const value = ethers.parseEther(amount);

  // get EIP-1559 gas settings
  const {
    maxFeePerGasInWei,
    maxPriorityFeePerGasInWei,
  } = await getBaseGasFees(gasChoiceDefault, customGweiAmount, supportsEIP1559, provider);

  await enforceAccountSwitch(ConnectorRoles.PUBLIC);

  const tx = await publicWalletSigner.sendTransaction({
    to: receiver,
    value,
    chainId,
    maxFeePerGas: maxFeePerGasInWei,
    maxPriorityFeePerGas: maxPriorityFeePerGasInWei,
  });

  return tx.hash;
}
