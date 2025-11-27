import { Contract } from "ethers";
import { withRetry } from "./withRetry";

const decimalsCache: Record<string, number> = {};

// sanity bounds: realistically all ERC20s use 0–36
const MIN_DECIMALS = 0;
const MAX_DECIMALS = 36;

export async function getCachedTokenDecimals(
  chainId: number,
  tokenContract: Contract,
  tokenAddress: string
): Promise<number> {
  const lowercaseAddress = tokenAddress.toLowerCase();
  const cacheKey = `${chainId}-${lowercaseAddress}`;

  if (decimalsCache[cacheKey] !== undefined) {
    return decimalsCache[cacheKey];
  }

  const decimals = await withRetry(async () => {
    const raw = await tokenContract.decimals();
    const num = Number(raw);

    if (!Number.isInteger(num)) throw new Error("Non-integer decimals");
    if (num < MIN_DECIMALS || num > MAX_DECIMALS) {
      throw new Error(`Unrealistic decimals: ${num}`);
    }

    return num;
  }, "tokenContract.decimals()");

  decimalsCache[cacheKey] = decimals;
  return decimals;
}