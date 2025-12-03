import { JsonRpcProvider, FallbackProvider } from "ethers";
import { getFeeHistory } from "@wagmi/core";
import { useSettingsStore } from "~~/src/state-managers";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";
import { withRetry } from "~~/src/shared/utils/tokens";

const BLOCK_HISTORY_COUNT = 10;
const PRIORITY_FEE_PERCENTILE = 20;
const MAX_FEE_BUFFER_NUMERATOR = 3n;
const MAX_FEE_BUFFER_DENOMINATOR = 2n;

// Helpers
function calculateMedian(arr: bigint[]): bigint {
  if (arr.length === 0) throw new Error("Cannot calculate median of empty array");
  const s = [...arr].sort((a, b) => (a > b ? 1 : -1));
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2n : s[mid];
}

const toGwei = (wei: bigint) => wei / 1_000_000_000n;

const getSingleProvider = (provider: JsonRpcProvider | FallbackProvider): JsonRpcProvider =>
  provider instanceof JsonRpcProvider
    ? provider
    : (provider as any).providerConfigs[0].provider as JsonRpcProvider;

// Main
export async function getBaseGasFees(
  useDefault: boolean,
  customGwei: number,
  supportsEIP1559: boolean,
  provider: JsonRpcProvider | FallbackProvider
) {
  const wagmiConfig = useSettingsStore.getState().wagmiConfig;
  if (!wagmiConfig) throw new Error("Wagmi config not initialized");

  const singleProvider = getSingleProvider(provider);

  try {
    const block = await withRetry(() => singleProvider.getBlock("latest"), "singleProvider.getBlock function");

    if (!block || !("baseFeePerGas" in block) || block.baseFeePerGas === null) {
      throw new Error("baseFeePerGas is missing in the latest block");
    }

    const baseFee: bigint = block.baseFeePerGas;

    let gasPriceWei: bigint = 0n;
    let maxPriorityFeeWei: bigint = 0n;
    let maxFeeWei: bigint = 0n;

    if (useDefault) {
      if (supportsEIP1559) {
        const history = await getFeeHistory(wagmiConfig, {
          blockCount: BLOCK_HISTORY_COUNT,
          rewardPercentiles: [PRIORITY_FEE_PERCENTILE],
          blockTag: "latest",
        });

        const rawRewards = history.reward?.flat();
        if (!rawRewards || rawRewards.length === 0) {
          throw new Error("No priority fee samples");
        }

        const priorityFees = rawRewards
          .map(f => BigInt(f.toString()))
          .filter(f => f > 0n);

        if (priorityFees.length === 0) {
          const FALLBACK_PERCENTAGE = 5n; // 5% of base fee
          maxPriorityFeeWei = (baseFee * FALLBACK_PERCENTAGE) / 100n;
        } else {
          maxPriorityFeeWei = calculateMedian(priorityFees);
        }

        gasPriceWei = baseFee + maxPriorityFeeWei;

        maxFeeWei =
          ((baseFee + maxPriorityFeeWei) * MAX_FEE_BUFFER_NUMERATOR) /
          MAX_FEE_BUFFER_DENOMINATOR;
      } else {
        const feeData = await withRetry(() => singleProvider.getFeeData(), "singleProvider.getFeeData()");
        if (!feeData.gasPrice) {
          throw new Error("No feeData.gasPrice found.");
        }
        gasPriceWei = feeData.gasPrice;
      }
    } else {
      const customWei = BigInt(Math.round(customGwei * 1e9));
      gasPriceWei = customWei;

      if (supportsEIP1559) {
        maxPriorityFeeWei = customWei / 3n;

        const minimalRequired = baseFee! + maxPriorityFeeWei;
        maxFeeWei = customWei < minimalRequired ? minimalRequired : customWei;
      }
    }

    if (!gasPriceWei || gasPriceWei === 0n ||
      (supportsEIP1559 &&
        (!maxFeeWei ||
         !maxPriorityFeeWei ||
         maxFeeWei === 0n ||
         maxPriorityFeeWei === 0n)
      )
    ) {
      throw new Error(WALLET_MODE_NOTIFICATIONS.TRY_CUSTOM_FEE);
    }

    return {
      gasPriceInGwei: toGwei(gasPriceWei),
      gasPriceInWei: gasPriceWei,
      maxPriorityFeePerGasInWei: maxPriorityFeeWei,
      maxFeePerGasInWei: maxFeeWei,
    };
  } catch (error) {
    throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.TRY_CUSTOM_FEE, error);
  }
}