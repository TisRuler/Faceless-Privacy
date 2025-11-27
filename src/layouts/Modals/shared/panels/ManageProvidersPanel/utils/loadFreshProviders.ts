import { loadProvider as loadRailgunEngineProvider } from "@railgun-community/wallet";
import { reinitializeWagmiConfig } from "~~/src/config/wagmiConfig";
import { getEngineProviders } from "~~/src/railgun-engine/utils/getEngineProviders";
import { SupportedChainId } from "~~/src/shared/types";
import { NetworkName } from "@railgun-community/shared-models";
import { clearCachedEthersContractsByChainId } from "~~/src/shared/utils/tokens";
import { useSettingsStore } from "~~/src/state-managers";
import { RpcState } from "~~/src/shared/enums";
import { startEngine } from "~~/src/railgun-engine/startEngine";
import { shutdownWeb3ConnectionStack } from "./shutdownWeb3ConnectionStack";

const setRpcState = useSettingsStore.getState().setRpcState;
const setIsWeb3StackShutdown = useSettingsStore.getState().setIsWeb3StackShutdown;

export async function loadFreshProviders(
  chainID: SupportedChainId, 
  railgunNetworkName: NetworkName, 
  isCustom: boolean,
  isUpcomingNetworkActive: boolean,
) {

  await shutdownWeb3ConnectionStack(); // Clear stale RPC's

  // Set RPC state
  if (isCustom) {
    setRpcState(chainID, RpcState.Custom);
  } else {
    setRpcState(chainID, RpcState.Default);
  }

  const hasRailgunEngineStarted = useSettingsStore.getState().hasRailgunEngineStarted;
  const engineNeedsStarting = hasRailgunEngineStarted === false;

  // Clear caches
  await clearCachedEthersContractsByChainId(chainID);

  await reinitializeWagmiConfig(); // Activate's new provider list for everything non-railgun engine

  if (engineNeedsStarting) await startEngine(chainID, railgunNetworkName);

  // Replace old engine providers if needed
  if (isUpcomingNetworkActive) {
    const engineProviders = await getEngineProviders(chainID);
    await loadRailgunEngineProvider(engineProviders, railgunNetworkName);
  }

  setIsWeb3StackShutdown(false);
};