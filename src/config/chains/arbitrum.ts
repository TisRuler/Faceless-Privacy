import { 
  ChainType, 
  NetworkName, 
  RailgunProxyContract, 
  RelayAdaptContract,
} from "@railgun-community/shared-models";
import { ChainData } from "./types";
import { arbitrum } from "viem/chains";
import * as TokenLogo from "~~/src/assets/images/tokens";

export const ArbitrumData: ChainData = {
  id: 42161,
  name: "Arbitrum",
    
  // Public and Private flow
  publicModeBaseToken: {
    address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    logoURI: TokenLogo.ETH,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    chainId: 42161,
    isBaseToken: true,
  },
  privateModeBaseToken: {
    address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    logoURI: TokenLogo.ETH,
    name: "Ethereum",
    symbol: "WETH",
    decimals: 18,
    chainId: 42161
  },

  // Privacy pool viewing
  defaultShieldingTokensList: [
    {
      address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      commonQuantitys: ["25", "100", "1000", "2000"],
    },
    {
      address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
      commonQuantitys: ["25", "500", "1000", "2000"],
    },
    {
      address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
      commonQuantitys: ["25", "500", "1000", "2000"],
    },
    {
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      commonQuantitys: ["0.01", "0.05", "0.5", "1"],
    },
    {
      address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      commonQuantitys: ["0.01", "0.05", "0.5", "1"],
    },
  ],
  defaultPrivacyPoolTokenList: [] = [
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
  ],
  batchConfig: {
    customBlocksPerBatch: 22500,
    defaultBlocksPerBatch: 22500,
    batchQuantity: 20,
  },
  anonymityPoolAddress: RailgunProxyContract.Arbitrum,
  relayAdaptContract: RelayAdaptContract.Arbitrum,

  // Shared 
  railgunNetworkName: NetworkName.Arbitrum,
  railgunChain: {
    type: ChainType.EVM,
    id: 42161,
  },
  supportsEIP1559: false,
  blockExplorer: { name: "Arbiscan", url: "https://arbiscan.io" },
  popularTokenMetadata: {
    "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9": {
      logoUri: TokenLogo.Tether,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd",
    },
    "0xaf88d065e77c8cc2239327c5edb3a432268e5831": {
      logoUri: TokenLogo.USDC,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin-token&vs_currencies=usd",
    },
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8": {
      logoUri: TokenLogo.USDC,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin-token&vs_currencies=usd",
    },
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": {
      logoUri: TokenLogo.ETH,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    },
    "???????": {
      logoUri: TokenLogo.DAI,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=usd",
    },
    "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f": {
      logoUri: TokenLogo.WrappedBTC,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    },
  } as { [key: string]: { logoUri: string, tokenPriceApi: string } },

  // Other
  viemChain: arbitrum,
};