/**
 * This returns the total amount of the token held within the RAILGUN contracts along with the tokens logo, name, symbol and address.
 * 
 * Key input:
 * - `anonymityPoolAddress`: This is the address that hold's all the funds to every RAILGUN related wallet on your chosen chain.
 */

import { formatUnits } from "viem";
import { getTokenUri } from "~~/src/shared/utils/tokens";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { getViemContract } from "../getters";
import { PoolTokenData } from "../../types";

export const fetchTokenDetails = async (
  tokenAddress: string,
  anonymityPoolAddress: string
): Promise<PoolTokenData> => {
  const network = getActiveNetwork();

  const tokenContract = getViemContract(tokenAddress);

  const symbol = await tokenContract.read.symbol() as string;
  const name = await tokenContract.read.name() as string;
  const logoUri = getTokenUri(network, tokenAddress);
  const decimals = await tokenContract.read.decimals() as number;
  const anonymityPoolTokenBalanceUnformatted = await tokenContract.read.balanceOf([anonymityPoolAddress]) as bigint;
  const anonymityPoolTokenBalance = parseFloat(formatUnits(anonymityPoolTokenBalanceUnformatted, decimals));

  return {
    address: tokenAddress,
    symbol: symbol,
    name: name,
    decimals: decimals,
    anonymityPoolTokenBalance: anonymityPoolTokenBalance,
    logoUri: logoUri,
  };
};