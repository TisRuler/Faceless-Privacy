import { Chain as RailgunChain, NetworkName } from "@railgun-community/shared-models";
import { Chain as ViemChain } from "viem";
import { SupportedChainId } from "~~/src/shared/types";
import { Token } from "~~/src/shared/types";

export interface BlockExplorerDetails {
  name: string, 
  url: string 
}

export type ChainData = {
  id: SupportedChainId;
  name: string;
  viemChain: ViemChain;
  railgunNetworkName: NetworkName;
  railgunChain: RailgunChain;
  supportsEIP1559: boolean;
  blockExplorer: BlockExplorerDetails;
  privateModeBaseToken: Token;
  publicModeBaseToken: Token;
  defaultPrivacyPoolTokenList: string[];
  defaultShieldingTokensList: { address: string; commonQuantitys: string[] }[];
  batchConfig: {
    customBlocksPerBatch: number;
    defaultBlocksPerBatch: number;
    batchQuantity: number;
  };
  popularTokenMetadata: PopularTokenMetadata;
  anonymityPoolAddress: string; // RailgunProxyContract
  relayAdaptContract: string;
};
  
type TokenMetadata = {
  logoUri: string;
  tokenPriceApi: string;
  additionalInfo?: string;
};

type PopularTokenMetadata = Record<string, TokenMetadata>;