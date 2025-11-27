import { getShieldingFinalGasDetails, getPublicWalletData } from "../../proccessors";
import { JsonRpcProvider, FallbackProvider } from "ethers";
import { gasEstimateForShieldBaseToken, populateShieldBaseToken } from "@railgun-community/wallet";
import { TXIDVersion, NetworkName } from "@railgun-community/shared-models";
import { stringAmountToBigint } from "~~/src/screens/wallet-mode/utils/transactions/coreLogic/helper/stringAmountToBigInt";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { validateReceiverAddress } from "../helper/validateReceiverAddress";
import { validateAmount } from "../helper/validateAmount";
import { ConnectorRoles } from "~~/src/state-managers/connectorRolesStore";
import { enforceAccountSwitch } from "~~/src/shared/utils/wallet";

type ShieldBaseTokenParams = {
  provider: JsonRpcProvider | FallbackProvider;
  network: NetworkName;
  txIDVersion: TXIDVersion;
  amount: string;
  recipientAddress: string;
  gasChoiceDefault: boolean;
  customGweiAmount: number;
};

export async function shieldBaseTokenLogic({
  provider,
  network,
  txIDVersion,
  amount,
  recipientAddress,
  gasChoiceDefault,
  customGweiAmount,
}: ShieldBaseTokenParams) {
  
  validateAmount(amount);
  validateReceiverAddress(recipientAddress, true);
  
  const { publicModeBaseToken, id: chainId } = getActiveNetwork();

  const {
    publicWalletSigner,
    publicAddress,
    shieldPrivateKey,
  } = await getPublicWalletData();

  const wrappedERC20Amount = {
    tokenAddress: publicModeBaseToken.address,
    amount: await stringAmountToBigint(chainId, publicModeBaseToken.address, amount),
  };

  const { gasEstimate } = await gasEstimateForShieldBaseToken(
    txIDVersion,
    network,
    recipientAddress,
    shieldPrivateKey,
    wrappedERC20Amount,
    publicAddress
  );

  const finalGasDetails = await getShieldingFinalGasDetails(
    network,
    gasEstimate,
    gasChoiceDefault,
    customGweiAmount,
    provider
  );

  const { transaction } = await populateShieldBaseToken(
    txIDVersion,
    network,
    recipientAddress,
    shieldPrivateKey,
    wrappedERC20Amount,
    finalGasDetails
  );

  await enforceAccountSwitch(ConnectorRoles.PUBLIC);

  const tx = await publicWalletSigner.sendTransaction({
    ...transaction,
    chainId,
  });

  return tx.hash;
};