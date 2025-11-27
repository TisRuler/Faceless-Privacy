import { unloadProvider as unloadRailgunEngineProvider } from "@railgun-community/wallet";
import { clearCachedEthersContractsByChainId } from "~~/src/shared/utils/tokens";
import { RpcState } from "~~/src/shared/enums";
import { useSettingsStore } from "~~/src/state-managers";
import { dummyWagmiConfig } from "~~/src/config/wagmiConfig";
import { disconnectAllConnectors } from "~~/src/shared/utils/wallet";

export const shutdownWeb3ConnectionStack = async (): Promise<void> => {
  
  const { 
    activeNetwork, 
    upcomingNetwork, 
    wagmiConfig,
    setRpcState, 
    setWagmiConfig,
    setIsWeb3StackShutdown,
  } = useSettingsStore.getState();
    
  const results = await Promise.allSettled([
    disconnectAllConnectors(wagmiConfig),
    clearCachedEthersContractsByChainId(activeNetwork.id),
    unloadRailgunEngineProvider(activeNetwork.railgunNetworkName)
  ]);
    
  setWagmiConfig(dummyWagmiConfig()); // Kill Wagmi client, hard disconnect (Wallet and Providers)

  const hasFailure = results.some(r => r.status === "rejected");

  setRpcState(upcomingNetwork.id, RpcState.Off);
  setIsWeb3StackShutdown(true);

  if (hasFailure) {
    window.location.reload(); // Brutal: Hard refresh immediately on failure, no half-measures on privacy
  }
};
