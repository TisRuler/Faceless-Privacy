import { 
  ChainType, 
  NetworkName, 
  RailgunProxyContract, 
  RelayAdaptContract 
} from "@railgun-community/shared-models";
import { ChainData } from "./types";
import { sepolia } from "viem/chains";
import * as TokenLogo from "~~/src/assets/images/tokens";

export const EthereumSepoliaData: ChainData = {
  id: 11155111,
  name: "Ethereum Sepolia",

  // Public and Private flow
  publicModeBaseToken: {
    address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    logoURI: TokenLogo.ETH,
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    chainId: 11155111,
    isBaseToken: true,
  },
  privateModeBaseToken: {
    address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    logoURI: TokenLogo.ETH,
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    chainId: 11155111,
  },

  // Privacy pool viewing
  defaultShieldingTokensList: [
    {
      address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
      commonQuantitys: ["0.01", "0.05", "0.1", "0.5"],
    },
  ],
  defaultPrivacyPoolTokenList: [] = [
    "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
  ], 
  batchConfig: {
    customBlocksPerBatch: 3000,
    defaultBlocksPerBatch: 3000,
    batchQuantity: 10,
  },
  anonymityPoolAddress: RailgunProxyContract.Ethereum_Sepolia,
  relayAdaptContract: RelayAdaptContract.Ethereum_Sepolia,

  // Shared 
  railgunNetworkName: NetworkName.EthereumSepolia,
  railgunChain: {
    type: ChainType.EVM,
    id: 11155111,
  },
  supportsEIP1559: true,
  blockExplorer: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  popularTokenMetadata: {
    "0xfff9976782d46cc05630d1f6ebab18b2324d6b14": { // check this
      logoUri: TokenLogo.ETH,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    },
  } as { [key: string]: { logoUri: string, tokenPriceApi: string } },

  // Other
  viemChain: {
    ...sepolia,
    name: "Eth Sepolia", // Renamed, "Sepolia" for clarity
  },
};