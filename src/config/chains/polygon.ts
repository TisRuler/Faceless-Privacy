import { 
  ChainType, 
  NetworkName, 
  RailgunProxyContract, 
  RelayAdaptContract
} from "@railgun-community/shared-models";
import { ChainData } from "./types";
import { polygon } from "viem/chains";
import * as TokenLogo from "~~/src/assets/images/tokens";

export const PolygonData: ChainData = {
  id: 137,
  name: "Polygon",

  // Public and Private flow
  publicModeBaseToken: {
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    logoURI: TokenLogo.Polygon,
    name: "Polygon Ecosystem Token",
    symbol: "POL",
    decimals: 18,
    chainId: 137,
    isBaseToken: true,
  },
  privateModeBaseToken: {
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    logoURI: TokenLogo.Polygon,
    name: "Wrapped Polygon Ecosystem Token",
    symbol: "WPOL",
    decimals: 18,
    chainId: 137,
  },

  // Privacy pool viewing
  defaultShieldingTokensList: [
    {
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      commonQuantitys: ["50", "250", "500", "1000"],
    },
    {
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      commonQuantitys: ["100", "200", "500", "1000"],
    },
    {
      address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      commonQuantitys: ["10", "100", "1000", "2000"],
    },
    {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      commonQuantitys: ["50", "500", "1000", "2000"],
    },
  ],
  defaultPrivacyPoolTokenList: [
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // WPOL
    "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359", // USD Coin
  ],
  batchConfig: {
    customBlocksPerBatch: 2500,
    defaultBlocksPerBatch: 2500,
    batchQuantity: 20,
  },
  anonymityPoolAddress: RailgunProxyContract.Polygon,
  relayAdaptContract: RelayAdaptContract.Polygon,

  // Shared 
  railgunNetworkName: NetworkName.Polygon,
  railgunChain: {
    type: ChainType.EVM,
    id: 137,
  },
  supportsEIP1559: true,
  blockExplorer: { name: "Polyscan", url: "https://polygonscan.com" },
  popularTokenMetadata: {
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": {
      logoUri: TokenLogo.Tether,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd",
    },
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": {
      logoUri: TokenLogo.USDC,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin-token&vs_currencies=usd",
    },
    "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359": {
      logoUri: TokenLogo.USDC,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin-token&vs_currencies=usd",
    },
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": {
      logoUri: TokenLogo.Polygon,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd",
    },
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": {
      logoUri: TokenLogo.ETH,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    },
    "0x92a9c92c215092720c731c96d4ff508c831a714f": {
      logoUri: "https://link-to-rail-polygon-logo.png",
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=railgun&vs_currencies=usd",
    },
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": {
      logoUri: TokenLogo.DAI,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=usd",
    },
    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": {
      logoUri: TokenLogo.WrappedBTC,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    },
  } as { [key: string]: { logoUri: string, tokenPriceApi: string } },

  // Other
  viemChain: polygon,
};