import { calculateGasPrice, TransactionGasDetails } from "@railgun-community/shared-models";

export const getOverallBatchMinGasPrice = async (isUsingSelfSignMethod: boolean, transactionGasDetails: TransactionGasDetails | undefined) => {
      
  let overallBatchMinGasPrice;
  if (isUsingSelfSignMethod) {
    overallBatchMinGasPrice = undefined; // self signed private mode tx's should set this to undefined always
  } else {
    overallBatchMinGasPrice = await calculateGasPrice(transactionGasDetails!);
  }
        
  return overallBatchMinGasPrice;
};