import { SupportedChainId } from "~~/src/shared/types";
import { RpcState } from "~~/src/shared/enums";
import { useSettingsStore } from "~~/src/state-managers";
import { DEFAULT_RPC_URLS } from "~~/src/config/defaultRpcUrls";
import { filterForValidDefaultRpcs, filterForValidCustomRpcs } from "~~/src/layouts/Modals/shared/utils/areRpcsValid";

const UNUSABLE_RPC = "http://0.0.0.0";

export const getRpcsForChain = async (chainId: SupportedChainId) => {
  const { rpcStateMap, customRpcs, upcomingNetwork } = useSettingsStore.getState();
  const rpcState = rpcStateMap[upcomingNetwork.id];

  if (rpcState === RpcState.Off) { return [UNUSABLE_RPC, UNUSABLE_RPC]; } // Always a minimum of 2, because fallback providers

  const isCustom = rpcState === RpcState.Custom;
  const isForCurrentChain = chainId === upcomingNetwork.id;
  
  const rpcList = isCustom ? customRpcs[upcomingNetwork.id] : DEFAULT_RPC_URLS[upcomingNetwork.id];

  const selectedRpcs = isForCurrentChain
    ? (isCustom ? await filterForValidCustomRpcs(rpcList, upcomingNetwork.id) : await filterForValidDefaultRpcs(rpcList, upcomingNetwork.id))
    : rpcList;
  
  return selectedRpcs;  // Return default RPCs
};