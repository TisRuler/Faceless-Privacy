import { getPublicClient } from ".";

export const getBlockRange = async (
  batch: number,
  blocksPerBatch: number
) => {
  const publicClient = getPublicClient();
  const latestBlockNumber = await publicClient.getBlockNumber();

  const fromBlock = latestBlockNumber - BigInt(blocksPerBatch) * BigInt(batch + 1);
  const toBlock = latestBlockNumber - BigInt(blocksPerBatch) * BigInt(batch);

  return {
    fromBlock: fromBlock < 0n ? 0n : fromBlock, // Ensure it's not negative
    toBlock,
  };
};