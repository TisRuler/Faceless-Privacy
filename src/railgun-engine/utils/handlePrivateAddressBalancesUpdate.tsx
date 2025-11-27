import { getTokenDataForPrivateAddress } from "./getTokenDataForPrivateAddress";
import { sortAndFilterTokens, isValidTokenInfo } from "~~/src/shared/utils/tokens";
import { RailgunBalancesEvent, RailgunERC20Amount, RailgunWalletBalanceBucket } from "@railgun-community/shared-models";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { UserToken } from "~~/src/shared/types";
import { logError } from "~~/src/shared/utils/other/logError";

// Main function to get enriched private address balances and set them in store
export const handlePrivateAddressBalancesUpdate = async ({ erc20Amounts, balanceBucket }: RailgunBalancesEvent) => {
  const enrichedTokens = await enrichAndSortTokens(erc20Amounts, balanceBucket);
  applyPrivateTokensInfoToStore(balanceBucket, enrichedTokens);
};

// Formats the tokens by getting additional token details and adding a category
const enrichAndSortTokens = async (tokens: RailgunERC20Amount[], bucket: RailgunWalletBalanceBucket) => {
  try {
    const allTokensDetails = await Promise.all(tokens.map(async (token) => {
      const tokenDetails = await getTokenDataForPrivateAddress(token);
      if (tokenDetails) {
        (tokenDetails).category = bucket;
      }
      return tokenDetails;
    }));

    const validTokensInfo = allTokensDetails.filter(isValidTokenInfo);
    const sortedTokens = sortAndFilterTokens(validTokensInfo);
    return sortedTokens;
  } catch (error) {
    logError(error);
    return [];
  }
};

// Make token data globally accessible
const applyPrivateTokensInfoToStore = (bucket: RailgunWalletBalanceBucket, tokens: UserToken[]) => {
  const { 
    setPendingPrivateTokens, 
    setSpendablePrivateTokens, 
    setNonSpendablePrivateTokens 
  } = usePrivateAddressStore.getState();

  switch (bucket) {
  case RailgunWalletBalanceBucket.ShieldPending:
    setPendingPrivateTokens(tokens);
    break;
  case RailgunWalletBalanceBucket.Spendable:
    setSpendablePrivateTokens(tokens);
    break;
  case RailgunWalletBalanceBucket.ShieldBlocked:
  case RailgunWalletBalanceBucket.MissingInternalPOI:
  case RailgunWalletBalanceBucket.MissingExternalPOI:
    setNonSpendablePrivateTokens(tokens); 
    break;
  default:
    console.warn("Unknown balance bucket:", bucket);
  }
};
