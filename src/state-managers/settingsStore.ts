import { create } from "zustand";
import { masterConfig } from "~~/src/config/masterConfig";
import { dummyWagmiConfig } from "../config/wagmiConfig";
import { SupportedChainId } from "~~/src/shared/types";
import { ChainData } from "../config/chains/types";
import { Config } from "wagmi";
import { RpcState, CardView } from "~~/src/shared/enums";

interface SettingsStore {
  activeNetwork: ChainData;
  setActiveNetwork: (activeNetwork: ChainData) => void;

  upcomingNetwork: ChainData;
  setUpcomingNetwork: (previousNetwork: ChainData) => void;
  
  hasRailgunEngineStarted: boolean;
  setHasRailgunEngineStarted: (value: boolean) => void;

  isWeb3StackShutdown: boolean;
  setIsWeb3StackShutdown: (value: boolean) => void;

  gasChoiceDefault: boolean;
  setGasChoiceDefault: (value: boolean) => void;
  customGweiAmount: number;
  setCustomGweiAmount: (value: number) => void;

  rpcStateMap: Record<SupportedChainId, RpcState>;
  setRpcState: (chainId: SupportedChainId, state: RpcState) => void;

  customRpcs: Record<SupportedChainId, string[]>;
  addCustomRpc: (chainId: SupportedChainId, rpcUrl: string) => void;
  removeCustomRpc: (chainId: SupportedChainId, rpcUrl: string) => void;
  clearCustomRpcs: (chainId: SupportedChainId) => void;

  walletModeCardView: CardView;
  setWalletModeCardView: (value: CardView) => void;

  wagmiConfig: Config;
  setWagmiConfig: (config: Config) => void;
}

export const DEFAULT_RPC_STATE: Record<SupportedChainId, RpcState> = Object.fromEntries(
  masterConfig.viem.supportedNetworks.map((chain) => [chain.id, RpcState.Default])
) as Record<SupportedChainId, RpcState>;


export const useSettingsStore = create<SettingsStore>((set, get) => ({
  activeNetwork: masterConfig.initialActiveNetwork,
  setActiveNetwork: (activeNetwork) => set({ activeNetwork }),

  upcomingNetwork: masterConfig.initialActiveNetwork,
  setUpcomingNetwork: (value) => set({ upcomingNetwork: value }),

  hasRailgunEngineStarted: false,
  setHasRailgunEngineStarted: (value: boolean) => set({ hasRailgunEngineStarted: value }),
  
  isWeb3StackShutdown: false,
  setIsWeb3StackShutdown: (value: boolean) => set({ isWeb3StackShutdown: value }),

  gasChoiceDefault: true,
  setGasChoiceDefault: (value) => set({ gasChoiceDefault: value }),

  customGweiAmount: 0,
  setCustomGweiAmount: (value) => set({ customGweiAmount: value }),

  rpcStateMap: DEFAULT_RPC_STATE,
  setRpcState: (chainId: SupportedChainId, state: RpcState) => {
    set((current) => ({
      rpcStateMap: {
        ...current.rpcStateMap,
        [chainId]: state,
      },
    }));
  },
  
  customRpcs: {
    137: [],
    // 80002: [],
    56: [],
    1: [],
    11155111: [],
    42161: [],
  },

  addCustomRpc: (chainId, rpcUrl) =>
    set((state) => ({
      customRpcs: {
        ...state.customRpcs,
        [chainId]: [...state.customRpcs[chainId], rpcUrl],
      },
    })),

  removeCustomRpc: (chainId, rpcUrl) =>
    set((state) => ({
      customRpcs: {
        ...state.customRpcs,
        [chainId]: state.customRpcs[chainId].filter((url) => url !== rpcUrl),
      },
    })),

  clearCustomRpcs: (chainId) =>
    set((state) => ({
      customRpcs: {
        ...state.customRpcs,
        [chainId]: [],
      },
    })),

  walletModeCardView: CardView.Public,
  setWalletModeCardView: (value) => set({ walletModeCardView: value }),

  wagmiConfig: dummyWagmiConfig(masterConfig.initialActiveNetwork),
  setWagmiConfig: (value) => set({ wagmiConfig: value }),
}));