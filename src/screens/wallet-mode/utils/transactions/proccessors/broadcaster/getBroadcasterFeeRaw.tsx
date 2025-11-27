import { FeeTokenDetails, TransactionGasDetails } from "@railgun-community/shared-models";
import { calculateBroadcasterFeeERC20Amount } from "@railgun-community/wallet";

export const getBroadcasterFeeRaw = async (feeTokenDetails: FeeTokenDetails | undefined, transactionGasDetails: TransactionGasDetails) => {
    
  if (feeTokenDetails) {
    const unformattedBroadcasterFee = await calculateBroadcasterFeeERC20Amount(feeTokenDetails, transactionGasDetails).amount;
    return unformattedBroadcasterFee;
  } else {
    return undefined;
  }
};