import { 
  ChainType, 
  NetworkName, 
  RailgunProxyContract, 
  RelayAdaptContract 
} from "@railgun-community/shared-models";
import { ChainData } from "./types";
import { bsc } from "viem/chains";
import * as TokenLogo from "~~/src/assets/images/tokens";
  
export const BinanceSmartChainData: ChainData = {
  id: 56,
  name: "Binance Smart Chain",
  
  // Public and Private flow
  publicModeBaseToken: {
    address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    logoURI: TokenLogo.BNB,
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18,
    chainId: 56,
    isBaseToken: true,
  },
  privateModeBaseToken: {
    address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    logoURI: TokenLogo.BNB,
    name: "Wrapped Binance Coin",
    symbol: "WBNB",
    decimals: 18,
    chainId: 56,
  },
  
  // Privacy pool viewing
  defaultShieldingTokensList: [
    {
      address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      commonQuantitys: ["0.01", "0.2", "1", "3"],
    },
  ],
  defaultPrivacyPoolTokenList: [] = [
    "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  ],
  batchConfig: {
    customBlocksPerBatch: 5000,
    defaultBlocksPerBatch: 5000,
    batchQuantity: 20,
  },
  anonymityPoolAddress: RailgunProxyContract.BNB_Chain,
  relayAdaptContract: RelayAdaptContract.BNB_Chain,
  
  // Shared
  railgunNetworkName: NetworkName.BNBChain,
  railgunChain: {
    type: ChainType.EVM,
    id: 56,
  },
  supportsEIP1559: false,
  blockExplorer: { name: "BscScan", url: "https://bscscan.com" },
  popularTokenMetadata: {
    "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": {
      logoUri: TokenLogo.BNB,
      tokenPriceApi: "https://api.coingecko.com/api/v3/simple/price?ids=bnb&vs_currencies=usd",
    },
  } as { [key: string]: { logoUri: string, tokenPriceApi: string } },
  
  // Other
  viemChain: bsc,
};