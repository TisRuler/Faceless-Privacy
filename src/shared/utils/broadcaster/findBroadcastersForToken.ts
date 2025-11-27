import { formatUnits } from "ethers";
import { getCachedTokenDecimals, getCachedEthersERC20Contract } from "../tokens";
import { WakuBroadcasterClient } from "@railgun-community/waku-broadcaster-client-web";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { useBroadcasterStore } from "~~/src/state-managers";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "../other/throwErrorWithTitle";
import { SelectedBroadcaster } from "@railgun-community/shared-models";
import { SendableToken, SupportedChainId } from "../../types";

// Cache keyed by chainId -> tokenAddress -> SelectedBroadcaster[]
const broadcasterCache = new Map<SupportedChainId, Map<string, SelectedBroadcaster[]>>();
let lastPurge = Date.now();

// Purge and refresh every 3 hours
const CACHE_TTL = 3 * 60 * 60 * 1000;
const purgeCacheIfExpired = () => {
  if (Date.now() - lastPurge >= CACHE_TTL) {
    broadcasterCache.clear();
    lastPurge = Date.now();
  }
};

/* 
  The cache is useful for merging and maintaining a consistent in-memory list, but it’s not actually reducing load or latency.
  Caches broadcasters per chainId + tokenAddress to avoid repeated network calls.
  Merges new results into cache, removing duplicates by railgunAddress + tokenAddress + fee.
  Filters broadcasters by fee (0.6–2.5).
  Cache auto-clears every 3 hours. 
*/
export const findBroadcastersForToken = async (): Promise<SelectedBroadcaster[]> => {
  try {
    purgeCacheIfExpired();

    const { railgunChain, id: chainId } = getActiveNetwork();
    const { broadcasterFeeToken } = useBroadcasterStore.getState();
    const tokenKey = broadcasterFeeToken.address.toLowerCase();

    if (!broadcasterCache.has(chainId)) broadcasterCache.set(chainId, new Map());
    const chainCache = broadcasterCache.get(chainId)!;

    const cached = chainCache.get(tokenKey) ?? [];

    const freshBroadcasters = await WakuBroadcasterClient.findBroadcastersForToken(
      railgunChain,
      broadcasterFeeToken.address,
      false
    );

    const filteredFreshBroadcasters = await filterBroadcasters(freshBroadcasters, broadcasterFeeToken, chainId);

    // Merge unique
    const merged = [
      ...cached,
      ...filteredFreshBroadcasters.filter(
        n =>
          !cached.some(
            c =>
              c.railgunAddress === n.railgunAddress &&
              c.tokenAddress === n.tokenAddress &&
              c.tokenFee.feePerUnitGas === n.tokenFee.feePerUnitGas
          )
      ),
    ];

    chainCache.set(tokenKey, merged);
    return merged;
  } catch (error) {
    throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.ERROR_FINDING_BROADCASTER, error);
  }
};

// Filters broadcasters by fee.
const filterBroadcasters = async (
  freshBroadcasters: SelectedBroadcaster[],
  broadcasterFeeToken: SendableToken,
  chainId: SupportedChainId
): Promise<SelectedBroadcaster[]> => {
  const tokenContract = await getCachedEthersERC20Contract(chainId, broadcasterFeeToken.address);
  const decimals = await getCachedTokenDecimals(chainId, tokenContract, broadcasterFeeToken.address);

  return freshBroadcasters
    .map(b => ({
      ...b,
      broadcasterFee: Number(formatUnits(BigInt(b.tokenFee.feePerUnitGas), decimals)),
    }))
    .filter(b => b.broadcasterFee >= 0.6 && b.broadcasterFee <= 2.5);
};
