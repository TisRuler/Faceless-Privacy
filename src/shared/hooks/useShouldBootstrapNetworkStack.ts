import { useSettingsStore } from "~~/src/state-managers";
import { RpcState } from "../enums";

export function useShouldBootstrapNetworkStack(): boolean {
  const activeNetwork = useSettingsStore((store) => store.activeNetwork);
  const upcomingNetwork = useSettingsStore((store) => store.upcomingNetwork);
  const hasRailgunEngineStarted = useSettingsStore((store) => store.hasRailgunEngineStarted);
  const rpcState = useSettingsStore((store) => store.rpcStateMap[activeNetwork.id]);
  const isWeb3StackShutdown = useSettingsStore((store) => store.isWeb3StackShutdown);

  const isSwitchingNetwork = activeNetwork.id !== upcomingNetwork.id;
  const isRpcDisconnected = rpcState === RpcState.Off;
  const doesRailgunEngineNeedStarting = !hasRailgunEngineStarted;

  return isRpcDisconnected || doesRailgunEngineNeedStarting || isSwitchingNetwork || isWeb3StackShutdown;
}