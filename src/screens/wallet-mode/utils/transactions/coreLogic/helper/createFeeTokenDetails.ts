import { FeeTokenDetails, SelectedBroadcaster } from "@railgun-community/shared-models";

export const createFeeTokenDetails = (
  isUsingSelfSignMethod: boolean,
  tokenAddress: string,
  feePerUnitGas: SelectedBroadcaster | undefined
): FeeTokenDetails | undefined => {
  if (isUsingSelfSignMethod) return undefined;
  
  return {
    tokenAddress,
    feePerUnitGas: BigInt(feePerUnitGas!.tokenFee.feePerUnitGas),
  };
};
