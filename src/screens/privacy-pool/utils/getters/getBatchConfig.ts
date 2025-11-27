import { useSettingsStore } from "~~/src/state-managers";
import { RpcState } from "~~/src/shared/enums";

export const getBatchConfig = () => {
  const { activeNetwork, rpcStateMap } = useSettingsStore.getState();

  const rpcState = rpcStateMap[activeNetwork.id];

  if (rpcState === RpcState.Off) throw new Error("RPC IS OFF");

  const config = activeNetwork.batchConfig;

  const blocksPerBatch = rpcState === RpcState.Custom // Some chains may allow custom RPC users to have a bigger blocksPerBatch
    ? config.customBlocksPerBatch
    : config.defaultBlocksPerBatch;

  return { blocksPerBatch, quantityOfBatches: config.batchQuantity };
};