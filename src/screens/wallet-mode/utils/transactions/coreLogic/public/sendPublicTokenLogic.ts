import { FallbackProvider, JsonRpcProvider, ethers } from "ethers";
import { validateAmount } from "../helper/validateAmount";
import { validateReceiverAddress } from "../helper/validateReceiverAddress";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { enforceAccountSwitch, getPublicWalletSigner } from "~~/src/shared/utils/wallet";
import { ConnectorRoles } from "~~/src/state-managers/connectorRolesStore";
import { getBaseGasFees } from "../../proccessors";

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
] as const;

type SendTokenParams = {
  tokenAddress: string;
  amount: string;
  receiver: string;
  gasChoiceDefault: boolean;
  customGweiAmount: number;
  provider: FallbackProvider | JsonRpcProvider,
};

export async function sendPublicTokenLogic({
  tokenAddress,
  amount,
  receiver,
  gasChoiceDefault,
  customGweiAmount,
  provider,
}: SendTokenParams): Promise<string> {
  
  validateAmount(amount);
  validateReceiverAddress(receiver, false);

  const { id: chainId, supportsEIP1559 } = getActiveNetwork();

  const signer = await getPublicWalletSigner();

  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const decimals: number = await tokenContract.decimals();
  const parsedAmount = ethers.parseUnits(amount, decimals);

  const { maxFeePerGasInWei, maxPriorityFeePerGasInWei } =
    await getBaseGasFees(gasChoiceDefault, customGweiAmount, supportsEIP1559, provider);

  await enforceAccountSwitch(ConnectorRoles.PUBLIC);

  const tx = await tokenContract.transfer(receiver, parsedAmount, {
    chainId,
    maxFeePerGas: maxFeePerGasInWei,
    maxPriorityFeePerGas: maxPriorityFeePerGasInWei,
  });

  return tx.hash;
}
