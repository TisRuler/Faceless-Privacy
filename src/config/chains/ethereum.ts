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
  } as { [key: string]: { logoUri: string, tokenPriceApi: string } },

  // Other
  viemChain: mainnet,
};