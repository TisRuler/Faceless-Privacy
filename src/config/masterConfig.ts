import { 
  EthereumData, 
  PolygonData, 
  // polygonAmoyData,
  ArbitrumData, 
  EthereumSepoliaData,
  BinanceSmartChainData
} from "~~/src/config/chains";
import { ChainData } from "./chains/types";
import pkg from "../../package.json" assert { type: "json" };

const chainIdToNetworkConfig = {
  1: EthereumData,
  137: PolygonData,
  56: BinanceSmartChainData,
  // 80002: polygonAmoyData,
  42161: ArbitrumData,
  11155111: EthereumSepoliaData,
} as const satisfies Record<number, ChainData>;

const viemClientSettings = { // The first chain in supportedNetworks list must match initialChain
  initialChain: EthereumData.viemChain,
  supportedNetworks: [
    PolygonData.viemChain,
    EthereumData.viemChain,
    BinanceSmartChainData.viemChain,
    // polygonAmoyData.viemChain,
    ArbitrumData.viemChain,
    EthereumSepoliaData.viemChain,
  ] satisfies ChainData["viemChain"][],
  pollingInterval: 0,
} as const;

// Single source of truth for all global configs
export const masterConfig = {
  version: pkg.version,
  facelessMnemonicLength: 12,
  initialActiveNetwork: EthereumData,
  networks: chainIdToNetworkConfig,
  viem: viemClientSettings, // Used for providers and public wallet connection/usage
  PoiNodeUrl: "https://ppoi-agg.horsewithsixlegs.xyz", 
  pubSubTopic: "/waku/2/rs/0/1",
  peerDiscoveryTimeout: 25000,
  facelessAccessMessage: "Faceless - Sign only to access your private address. Beware of impersonators.",
  baseUrl: "https://facelessprivacy.eth.limo",
};