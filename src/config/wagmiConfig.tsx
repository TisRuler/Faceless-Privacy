import { createConfig } from "wagmi";
import { masterConfig } from "~~/src/config/masterConfig";
import { fallback, http } from "@wagmi/core";
import { useSettingsStore } from "~~/src/state-managers";
import { SupportedChainId } from "~~/src/shared/types";
import { createClient, FallbackTransport, Transport } from "viem";
import { ChainData } from "./chains/types";
import { getRpcsForChain } from "../shared/utils/network";
import { disconnectAllConnectors } from "../shared/utils/wallet";
import { EthereumData } from "./chains";

// Shared helper
const createWagmiConfig = (transport: FallbackTransport<Transport[]>, upcomingNetwork: ChainData) => {

  return createConfig({
    chains: [upcomingNetwork.viemChain],
    syncConnectedChain: true,
    ssr: false, // Ensures Wagmi runs only on the client for privacy
    client({ chain }) {
      return createClient({
        chain,
        pollingInterval: masterConfig.viem.pollingInterval,
        transport,
      });
    },
  });
};

// dumbyWagmiConfig helper
const getDummyTransport = () => {

  const getDumbyRpc = () => {
    const selectedRpcUrls = ["http://0.0.0.0"];
  
    return selectedRpcUrls.map((rpc) => http(rpc));
  };

  return fallback(getDumbyRpc());
};

// reinitializeWagmiConfig helper
const getReinitializedTransport = async (upcomingNetwork: ChainData) => {

  const chainId = upcomingNetwork.id;

  const getRpcs = async (chainId: SupportedChainId) => {

    const chosenRpcUrls = await getRpcsForChain(chainId);
  
    return chosenRpcUrls.map((rpc) => http(rpc));
  };

  return fallback(await getRpcs(chainId));
};

// Function used in settingsStore/wagmiConfig
// Prevents leaking ip on initialisation
export const dummyWagmiConfig = (upcomingNetwork?: ChainData) => {
  const transport = getDummyTransport();
  return createWagmiConfig(transport, EthereumData);
};

// Function to make new wagmiConfig globally accessible when user tweaks setting
export const reinitializeWagmiConfig = async (): Promise<void> => {

  const { wagmiConfig, setWagmiConfig, upcomingNetwork } = useSettingsStore.getState();

  await disconnectAllConnectors(wagmiConfig);

  const transport = await getReinitializedTransport(upcomingNetwork);
  const newConfig = await createWagmiConfig(transport, upcomingNetwork);

  setWagmiConfig(newConfig);
};