import { getEVMGasTypeForTransaction, EVMGasType, TransactionGasDetails, NetworkName, FeeTokenDetails, TXIDVersion, RailgunERC20AmountRecipient } from "@railgun-community/shared-models";
import { gasEstimateForUnprovenUnshield } from "@railgun-community/wallet";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";
import { isBalanceToLowError } from "~~/src/shared/utils/other/isBalanceToLowError";

export async function getGasEstimateForUnprovenUnshield(
  network: NetworkName,
  isUsingSelfSignMethod: boolean,
  railgunWalletId: string,
  gasPrice: bigint,
  maxFeePerGas: bigint,
  maxPriorityFeePerGas: bigint,
  feeTokenDetails: FeeTokenDetails | undefined,
  txIDVersion: TXIDVersion,
  encryptionKey: string,
  erc20AmountRecipients: RailgunERC20AmountRecipient[]
) {

  try {
    const evmGasType: EVMGasType = getEVMGasTypeForTransaction(
      network,
      isUsingSelfSignMethod
    );

    const originalGasEstimate = BigInt(0); // Always 0, we don't have this yet.

    let originalGasDetails: TransactionGasDetails;
    switch (evmGasType) {
    case EVMGasType.Type0:
    case EVMGasType.Type1: // type 1 = sending with broadcaster
      originalGasDetails = {
        evmGasType,
        gasEstimate: originalGasEstimate,
        gasPrice,
      };
      break;
    case EVMGasType.Type2:

      originalGasDetails = {
        evmGasType,
        gasEstimate: originalGasEstimate,
        maxFeePerGas,
        maxPriorityFeePerGas,
      };
      break;
    }

    const { gasEstimate } = await gasEstimateForUnprovenUnshield(
      txIDVersion,
      network,
        railgunWalletId!,
        encryptionKey,
        erc20AmountRecipients,
        [],
        originalGasDetails,
        feeTokenDetails,
        isUsingSelfSignMethod,
    );

    let transactionGasDetails: TransactionGasDetails;
    switch (evmGasType) {
    case EVMGasType.Type0:
    case EVMGasType.Type1: 
      transactionGasDetails = {
        evmGasType,
        gasEstimate,
        gasPrice,
      };
      break;
    case EVMGasType.Type2:
          
      transactionGasDetails = {
        evmGasType,
        gasEstimate,
        maxFeePerGas,
        maxPriorityFeePerGas,
      };
      break;
    }

    return transactionGasDetails;

  } catch (error) {
    if (isBalanceToLowError(error)) {
      throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.BALANCE_TOO_LOW, error); 
    } else {
      throw error; // this sometimes errors when the gas fees put through are too low
    }
  }
}