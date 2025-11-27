import { getBlockRange } from "../getters";
import { getBatchConfig } from "~~/src/screens/privacy-pool/utils/getters/getBatchConfig";
import { decodeEventLog, PublicClient } from "viem";
import { getLogs } from "viem/actions";
import { DecodedUnshieldEvent } from "../../types";
import { logError } from "~~/src/shared/utils/other/logError";
import { sleep } from "~~/src/shared/utils/other/sleep";
import { withRetry } from "~~/src/shared/utils/tokens";
import railgunEventAbi from "~~/src/assets/abis/railgunEventAbi.json";

const fetchUnshieldEventsInRange = async (
  publicClient: PublicClient,
  anonymityPoolAddress: string,
  unshieldEventAbi: any,
  fromBlock: bigint,
  toBlock: bigint,
  selectedTokenAddress: string
) => {
  // Fetch 'Unshield' events within the block range
  const unshieldEvents = await withRetry(() => getLogs(publicClient, {
    address: anonymityPoolAddress as `0x${string}`,
    event: unshieldEventAbi,
    fromBlock,
    toBlock,
  }), "getLogs(publicClient...");

  // Filter events by selected token address
  return unshieldEvents.filter((event) => {
    try {
      const decoded = decodeEventLog({
        abi: [unshieldEventAbi],
        data: event.data,
        topics: event.topics,
      }) as DecodedUnshieldEvent;

      return decoded?.args?.token?.tokenAddress?.toLowerCase() === selectedTokenAddress.toLowerCase();
    } catch (decodeError) {
      logError(decodeError);
    }
  });
};

export const fetchRawUnshieldTransactions = async (
  selectedTokenAddress: string,
  anonymityPoolAddress: string,
  publicClient: PublicClient
) => {
  const { blocksPerBatch, quantityOfBatches } = getBatchConfig();

  const unshieldEventAbi = railgunEventAbi.find((e) => e.name === "Unshield");
  if (!unshieldEventAbi) {
    throw new Error("Unshield event not found in ABI");
  }

  let allFilteredUnshieldEvents: any[] = [];

  // Loop through batches and fetch events
  for (let batch = 0; batch < quantityOfBatches; batch++) {
    const { fromBlock, toBlock } = await getBlockRange(batch, blocksPerBatch);

    await sleep(2000);
    
    // Fetch and filter 'Unshield' events for the current block range
    const filteredUnshieldEvents = await fetchUnshieldEventsInRange(
      publicClient,
      anonymityPoolAddress,
      unshieldEventAbi,
      fromBlock,
      toBlock,
      selectedTokenAddress
    );

    allFilteredUnshieldEvents = [...allFilteredUnshieldEvents, ...filteredUnshieldEvents];
  }

  // Sort the events by block number in ascending order
  allFilteredUnshieldEvents.sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  return allFilteredUnshieldEvents;
};
