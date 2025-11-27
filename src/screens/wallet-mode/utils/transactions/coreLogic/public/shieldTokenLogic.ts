import { getActiveNetwork } from "~~/src/shared/utils/network";
import { populateShield, gasEstimateForShield } from "@railgun-community/wallet";
import { TXIDVersion, RailgunERC20AmountRecipient, NetworkName } from "@railgun-community/shared-models";
import { stringAmountToBigint } from "~~/src/screens/wallet-mode/utils/transactions/coreLogic/helper/stringAmountToBigInt";
import { getShieldingFinalGasDetails } from "../../proccessors";
import { JsonRpcProvider, FallbackProvider, JsonRpcSigner } from "ethers";
import { validateReceiverAddress } from "../helper/validateReceiverAddress";
import { validateAmount } from "../helper/validateAmount";
import { ConnectorRoles } from "~~/src/state-managers/connectorRolesStore";
import { enforceAccountSwitch } from "~~/src/shared/utils/wallet";

type ShieldTokenParams = {
  provider: JsonRpcProvider | FallbackProvider;
  network: NetworkName;
  txIDVersion: TXIDVersion;
  tokenAddress: string;
  amount: string;
  recipientAddress: string;
  publicWalletSigner: JsonRpcSigner;
  publicAddress: string;
  shieldPrivateKey: string;
  gasChoiceDefault: boolean;
  customGweiAmount: number;
};

/* Use this function after ensuring tokens are approved */
export async function shieldTokenLogic({
  provider,
  network,
  txIDVersion,
  tokenAddress,
  amount,
  recipientAddress,
  publicWalletSigner,
  publicAddress,
  shieldPrivateKey,
  gasChoiceDefault,
  customGweiAmount,
}: ShieldTokenParams) {

  validateReceiverAddress(recipientAddress, true);
  validateAmount(amount);
  
  const { id: chainId } = getActiveNetwork();
  
  const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
    {
      tokenAddress,
      amount: await stringAmountToBigint(chainId, tokenAddress, amount),
      recipientAddress: recipientAddress,
    },
  ];

  const { gasEstimate } = await gasEstimateForShield(
    txIDVersion,
    network,
    shieldPrivateKey,
    erc20AmountRecipients,
    [], // nftAmountRecipients empty array
    publicAddress
  );

  const finalGasDetails = await getShieldingFinalGasDetails(
    network,
    gasEstimate,
    gasChoiceDefault,
    customGweiAmount,
    provider
  );

  const { transaction } = await populateShield(
    txIDVersion,
    network,
    shieldPrivateKey,
    erc20AmountRecipients,
    [],
    finalGasDetails
  );

  await enforceAccountSwitch(ConnectorRoles.PUBLIC);

  const tx = await publicWalletSigner.sendTransaction({
    ...transaction,
    chainId,
  });

  return tx.hash;
};