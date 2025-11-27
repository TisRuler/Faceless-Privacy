import { fetchRawUnshieldTransactions }from "../fetchers";
import { formatTransactions } from "../formatters/formatTransactions";
import { getPublicClient } from ".";

export const getFormattedUnshieldTransactions = async (tokenAddress: string, tokenDecimals: number, anonymityPoolAddress: string) => { 
  const publicClient = getPublicClient();

  const transferEvents = await fetchRawUnshieldTransactions(tokenAddress, anonymityPoolAddress, publicClient);

  const formattedTransactions = await formatTransactions(transferEvents, tokenDecimals, false, publicClient);

  return formattedTransactions.filter(tx => tx !== null); // Filter out null values
};
  