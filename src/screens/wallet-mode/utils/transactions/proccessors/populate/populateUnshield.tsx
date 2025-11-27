import { populateProvedUnshield } from "@railgun-community/wallet";
import { RailgunPopulateTransactionResponse, Chain } from "@railgun-community/shared-models";
import { BroadcasterTransaction } from "@railgun-community/waku-broadcaster-client-web";
import { 
  TXIDVersion, 
  NetworkName, 
  TransactionGasDetails, 
  RailgunERC20AmountRecipient, 
  SelectedBroadcaster 
} from "@railgun-community/shared-models";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";

export const populateUnshield = async (
  isUsingSelfSignMethod: boolean,
  txIDVersion: TXIDVersion,
  network: NetworkName,
  chain: Chain,
  railgunWalletId: string,
  erc20AmountRecipients: RailgunERC20AmountRecipient[],
  broadcasterFeeERC20AmountRecipient: RailgunERC20AmountRecipient | undefined,
  overallBatchMinGasPrice: bigint | undefined,
  transactionGasDetails: TransactionGasDetails,
  selectedBroadcaster: SelectedBroadcaster | undefined,
  useRelayAdapt: boolean
): Promise<any> => {
  try {

    const populateResponse: RailgunPopulateTransactionResponse = await populateProvedUnshield(
      txIDVersion,
      network,
      railgunWalletId,
      erc20AmountRecipients,
      [],
      broadcasterFeeERC20AmountRecipient,
      isUsingSelfSignMethod,
      overallBatchMinGasPrice,
      transactionGasDetails,
    );

    if (isUsingSelfSignMethod) {
      return populateResponse.transaction;
    } else {

      const nullifiers: string[] = populateResponse.nullifiers ?? [];
      const broadcasterTransaction = await BroadcasterTransaction.create(
        txIDVersion,
        populateResponse.transaction.to,
        populateResponse.transaction.data,
        selectedBroadcaster!.railgunAddress,
        selectedBroadcaster!.tokenFee.feesID, 
        chain,
        nullifiers,
        overallBatchMinGasPrice!,
        useRelayAdapt,
        populateResponse.preTransactionPOIsPerTxidLeafPerList,
      );

      return broadcasterTransaction;
    }
  } catch (error) {
    throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.POPULATION_ERROR, error);
  }
};
