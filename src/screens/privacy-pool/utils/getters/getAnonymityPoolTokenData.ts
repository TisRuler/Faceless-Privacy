import { fetchTokenDetails } from "../fetchers";
import { getFormattedShieldTransactions } from "./getFormattedShieldTransactions";
import { getFormattedUnshieldTransactions } from "./getFormattedUnshieldTransactions";
import { getCachedPrivacyPoolTokenData , setCachedPrivacyPoolTokenData} from "~~/src/shared/utils/tokens";
import { PoolTokenDetails } from "../../types";
import { BlockExplorerDetails } from "~~/src/config/chains/types";
import { CardView } from "~~/src/shared/enums";

/**
 * Caches token data by `chainId-tokenAddress-viewOption`
 */
export const getAnonymityPoolTokenData = async (
  viewOption: CardView,
  tokenListToDisplay: string[],
  anonymityPoolAddress: string,
  blockExplorer: BlockExplorerDetails,
  chainId: number
): Promise<PoolTokenDetails[]> => {

  const allFormattedTokenData = await Promise.all(
    tokenListToDisplay.map(async (tokenAddress: string) => {

      const cacheHit = getCachedPrivacyPoolTokenData(chainId, tokenAddress, viewOption);
      if (cacheHit) return cacheHit;

      const tokenDetails = await fetchTokenDetails(tokenAddress, anonymityPoolAddress);

      const fetchTransactions =
        viewOption === CardView.Public
          ? getFormattedShieldTransactions
          : getFormattedUnshieldTransactions;

      const recentTransactions = await fetchTransactions(
        tokenAddress,
        tokenDetails.decimals,
        anonymityPoolAddress
      );

      // Reverse to chronological order (newest first)
      const orderedTransactions = recentTransactions.slice().reverse();

      const half = Math.ceil(orderedTransactions.length / 2);

      const column1TransactionData = orderedTransactions.slice(0, half);
      const column2TransactionData = orderedTransactions.slice(half);

      const result: PoolTokenDetails = {
        ...tokenDetails,
        tokenInPoolLink: { 
          name: blockExplorer.name, 
          url: `${blockExplorer.url}/token/${tokenAddress}?a=${anonymityPoolAddress}`
        },
        column1TransactionData,
        column2TransactionData,
      };

      setCachedPrivacyPoolTokenData(chainId, tokenAddress, viewOption, result);
      return result;
    })
  );

  return allFormattedTokenData.filter(Boolean);
};