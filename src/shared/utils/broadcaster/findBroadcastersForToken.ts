import { formatUnits } from "ethers";
import { getCachedTokenDecimals, getCachedEthersERC20Contract } from "../tokens";
import { WakuBroadcasterClient } from "@railgun-community/waku-broadcaster-client-web";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { useBroadcasterStore } from "~~/src/state-managers";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "../other/throwErrorWithTitle";
import { SelectedBroadcaster } from "@railgun-community/shared-models";

// Fee thresholds
const STRICT_MIN_FEE = 0.85;
const STRICT_MAX_FEE = 2.5;
const LENIENT_MIN_FEE = 0.6;
const LENIENT_MAX_FEE = 8;
const MIN_BROADCASTERS_FOR_LENIENT_FALLBACK = 9;

// Main
export const findBroadcastersForToken = async (): Promise<SelectedBroadcaster[]> => {
  try {
    const { railgunChain, id: chainId } = getActiveNetwork();
    const { broadcasterFeeToken } = useBroadcasterStore.getState();

    const freshBroadcasters = await WakuBroadcasterClient.findBroadcastersForToken(
      railgunChain,
      broadcasterFeeToken.address,
      false
    );

    // - Deduplication
    const uniqueMap = new Map<string, SelectedBroadcaster>();
    for (const broadcaster of freshBroadcasters) {
      const existing = uniqueMap.get(broadcaster.railgunAddress);
      if (!existing || broadcaster.tokenFee.expiration > existing.tokenFee.expiration) {
        uniqueMap.set(broadcaster.railgunAddress, broadcaster);
      }
    }

    const tokenContract = await getCachedEthersERC20Contract(chainId, broadcasterFeeToken.address);
    const decimals = await getCachedTokenDecimals(chainId, tokenContract, broadcasterFeeToken.address);

    const uniqueBroadcasters = Array.from(uniqueMap.values());
    
    const broadcastersWithFees = uniqueBroadcasters.map(broadcaster => ({
      ...broadcaster,
      broadcasterFee: Number(formatUnits(BigInt(broadcaster.tokenFee.feePerUnitGas), decimals)),
    }));

    // - Strict fee filter
    let filteredBroadcasters = broadcastersWithFees.filter(
      b => b.broadcasterFee >= STRICT_MIN_FEE && b.broadcasterFee <= STRICT_MAX_FEE
    );
    
    // - If strict filter was too tight, fall back to lenient fee filter
    if (filteredBroadcasters.length < MIN_BROADCASTERS_FOR_LENIENT_FALLBACK) {
      filteredBroadcasters = broadcastersWithFees.filter(
        b => b.broadcasterFee >= LENIENT_MIN_FEE && b.broadcasterFee <= LENIENT_MAX_FEE
      );
    }

    return filteredBroadcasters;
    
  } catch (error) {
    throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.ERROR_FINDING_DEFAULT_BROADCASTER_FOR_TOKEN, error);
  }
};