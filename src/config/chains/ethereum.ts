import { 
  ChainType, 
  NetworkName, 
  RailgunProxyContract, 
  RelayAdaptContract 
} from "@railgun-community/shared-models";
import { ChainData } from "./types";
import { mainnet } from "viem/chains";
import * as TokenLogo from "~~/src/assets/images/tokens";

export const EthereumData: ChainData = {
  id: 1,
  name: "Ethereum",

  // Public and Private flow
  publicModeBaseToken: {
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    logoURI: TokenLogo.ETH,
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    chainId: 1,
    isBaseToken: true,
  },
  privateModeBaseToken: {
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    logoURI: TokenLogo.ETH,
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    chainId: 1,
  },

  // Privacy pool viewing
  defaultShieldingTokensList: [
    {
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      commonQuantitys: ["0.1", "1", "10", "100"],
    },
    {
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      commonQuantitys: ["100", "1000", "10000", "50000"],
    },
    {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      commonQuantitys: ["100", "1000", "10000", "20000"],
    },
    {
      address: "0x085780639cc2cacd35e474e71f4d000e2405d8f6",
      commonQuantitys: ["25", "50", "500", "1000"],
    },
  ],
  defaultPrivacyPoolTokenList: [] = [
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "0x6b175474e89094c44da98b954eedeac495271d0f",
    "0xdac17f958d2ee523a2206206994597c13d831ec7",
  ],
  batchConfig: {
    customBlocksPerBatch: 325,
    defaultBlocksPerBatch: 325,
    batchQuantity: 20,
  },
  anonymityPoolAddress: RailgunProxyContract.Ethereum,
  relayAdaptContract: RelayAdaptContract.Ethereum,

  // Shared
  railgunNetworkName: NetworkName.Ethereum,
  railgunChain: {
    type: ChainType.EVM,
    id: 1,
  },
  supportsEIP1559: true,
  blockExplorer: { name: "Etherscan", url: "https://etherscan.io" },
  popularTokenMetadata: {
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
      logoUri: TokenLogo.ETH,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    },
    "0x6b175474e89094c44da98b954eedeac495271d0f": {
      logoUri: TokenLogo.DAI,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=usd",
    },
    "0xdac17f958d2ee523a2206206994597c13d831ec7": {
      logoUri: TokenLogo.Tether,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd",
    },
    "0x085780639cc2cacd35e474e71f4d000e2405d8f6": {
      logoUri: TokenLogo.FxUsd,
      tokenPriceApi: "", // CoinGecko does'nt have fxUSD’s price data available via API yet
      additionalInfo: "f(x) Protocol is launching a fee-claim rebate program.\n\nThis program will allow users to reclaim some Railgun fees incurred during shielding.\n\nNote: f(x) Protocol is operated by a third party.\nDo your own research. Learn more [here](https://fx.aladdin.club).",
    },
  } as { [key: string]: { logoUri: string, tokenPriceApi: string } },

  // Other
  viemChain: mainnet,
};