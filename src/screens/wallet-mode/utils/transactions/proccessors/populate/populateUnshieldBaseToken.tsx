import { populateProvedUnshieldBaseToken } from "@railgun-community/wallet";
import { RailgunPopulateTransactionResponse, Chain } from "@railgun-community/shared-models";
import { BroadcasterTransaction } from "@railgun-community/waku-broadcaster-client-web";
import { 
  TXIDVersion, 
  NetworkName, 
  TransactionGasDetails, 
  RailgunERC20Amount, 
  RailgunERC20AmountRecipient, 
  SelectedBroadcaster 
} from "@railgun-community/shared-models";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";

export const populateUnshieldBaseToken = async (
  isUsingSelfSignMethod: boolean,
  txIDVersion: TXIDVersion,
  network: NetworkName,
  chain: Chain,
  recipientAddress: string,
  railgunWalletId: string,
  wrappedERC20Amount: RailgunERC20Amount,
  broadcasterFeeERC20AmountRecipient: RailgunERC20AmountRecipient | undefined,
  overallBatchMinGasPrice: bigint | undefined,
  transactionGasDetails: TransactionGasDetails,
  selectedBroadcaster: SelectedBroadcaster | undefined,
  useRelayAdapt: boolean
): Promise<any> => {
  try {

    const populateResponse: RailgunPopulateTransactionResponse = await populateProvedUnshieldBaseToken(
      txIDVersion,
      network,
      recipientAddress,
      railgunWalletId,
      wrappedERC20Amount,
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
