import { RailgunERC20AmountRecipient } from "@railgun-community/shared-models";

export const getBroadcasterFeeERC20AmountRecipient = async (
  isUsingSelfSignMethod: boolean,
  tokenAddress: string,
  unformattedBroadcasterFee: bigint | undefined,
  railgunAddress: string | undefined,
): Promise<RailgunERC20AmountRecipient | undefined> => {

  if (isUsingSelfSignMethod) {
    return undefined;
  }

  return {
    tokenAddress,
    amount: unformattedBroadcasterFee!,
    recipientAddress: railgunAddress!,
  };

};