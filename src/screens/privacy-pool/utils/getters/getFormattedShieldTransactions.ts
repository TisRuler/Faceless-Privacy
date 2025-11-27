import { fetchRawShieldTransactions }from "../fetchers";
import { formatTransactions } from "../formatters/formatTransactions";
import { getPublicClient } from ".";

export const getFormattedShieldTransactions = async (tokenAddress: string, tokenDecimals: number, anonymityPoolAddress: string) => {
  const publicClient = getPublicClient();

  const transferEvents = await fetchRawShieldTransactions(tokenAddress, anonymityPoolAddress, publicClient);

  const formattedTransactions = await formatTransactions(transferEvents, tokenDecimals, true, publicClient);
    
  return formattedTransactions.filter(tx => tx !== null); // Filter out null values
};
  