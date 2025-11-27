import { getBlockRange } from "../getters";
import { getBatchConfig } from "~~/src/screens/privacy-pool/utils/getters/getBatchConfig";
import { PublicClient, AbiEvent } from "viem";
import { getLogs } from "viem/actions";
import { sleep } from "~~/src/shared/utils/other/sleep";
import { withRetry } from "~~/src/shared/utils/tokens";
import ERC20Abi from "~~/src/assets/abis/ERCAbi.json";

export const fetchRawShieldTransactions = async (
  selectedTokenAddress: string,
  anonymityPoolAddress: string,
  publicClient: PublicClient,
) => {
  const { blocksPerBatch, quantityOfBatches } = getBatchConfig();
  let allFilteredShieldEvents: any[] = [];

  // Ensure we extract the correct event from the ABI
  const transferEvent = (ERC20Abi as any[]).find(
    (e): e is AbiEvent => e.type === "event" && e.name === "Transfer"
  );

  if (!transferEvent) {
    throw new Error("Transfer event not found in ABI");
  }

  for (let batch = 0; batch < quantityOfBatches; batch++) {
    const { fromBlock, toBlock } = await getBlockRange(batch, blocksPerBatch);

    await sleep(2000);

    const logs = await withRetry(() => getLogs(publicClient, {
      address: selectedTokenAddress as `0x${string}`,
      fromBlock,
      toBlock,
      event: transferEvent,
      args: { to: anonymityPoolAddress },
    }), "getLogs(publicClient...");

    allFilteredShieldEvents = allFilteredShieldEvents.concat(logs);
  }

  allFilteredShieldEvents.sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  return allFilteredShieldEvents;
};