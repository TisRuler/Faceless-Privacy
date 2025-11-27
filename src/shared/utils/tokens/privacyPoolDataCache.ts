import { PoolTokenDetails } from "../../../screens/privacy-pool/types";
import { CardView } from "~~/src/shared/enums";

const THIRTY_MINUTES = 30 * 60 * 1000;

// Key Builders
const buildTokenCacheKey = (chainId: number, tokenAddress: string, viewOption: CardView) =>
  `privacy-pool-token-${chainId}-${tokenAddress.toLowerCase()}-${viewOption}`;

const buildTimestampCacheKey = (chainId: number, tokenAddress: string, viewOption: CardView) =>
  `privacy-pool-token-timestamp-${chainId}-${tokenAddress.toLowerCase()}-${viewOption}`;

// Main Function
export const getCachedPrivacyPoolTokenData = (
  chainId: number,
  tokenAddress: string,
  viewOption: CardView
): PoolTokenDetails | undefined => {
  const tokenKey = buildTokenCacheKey(chainId, tokenAddress, viewOption);
  const timestampKey = buildTimestampCacheKey(chainId, tokenAddress, viewOption);

  const now = Date.now();
  const lastCacheTime = localStorage.getItem(timestampKey);
  const parsedTime = lastCacheTime ? parseInt(lastCacheTime, 10) : NaN;

  const isStale =
    !lastCacheTime ||
    Number.isNaN(parsedTime) ||
    now - parsedTime > THIRTY_MINUTES;

  if (isStale) {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(timestampKey);
    return undefined;
  }

  const json = localStorage.getItem(tokenKey);
  return json ? (JSON.parse(json) as PoolTokenDetails) : undefined;
};

// Main Function
export const setCachedPrivacyPoolTokenData = (
  chainId: number,
  tokenAddress: string,
  viewOption: CardView,
  data: PoolTokenDetails
) => {
  const timestampKey = buildTimestampCacheKey(chainId, tokenAddress, viewOption);
  localStorage.setItem(timestampKey, Date.now().toString());

  const tokenKey = buildTokenCacheKey(chainId, tokenAddress, viewOption);
  localStorage.setItem(tokenKey, JSON.stringify(data));
};

// Cache Clearers
export const clearCachedPrivacyPoolTokenDataByChainId = (chainId: number) => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`privacy-pool-token-${chainId}-`)) localStorage.removeItem(key);
  });

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`privacy-pool-token-timestamp-${chainId}-`)) localStorage.removeItem(key);
  });
};

// Clears all cached privacy pool data across all chains
export const clearAllCachedPrivacyPoolTokenData = (): void => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("privacy-pool-token-")) localStorage.removeItem(key);
  });
};
