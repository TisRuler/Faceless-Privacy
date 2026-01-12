import { masterConfig } from "../config/masterConfig";
import { RailgunWalletBalanceBucket } from "@railgun-community/shared-models";

export type SupportedChainId = keyof typeof masterConfig.networks;
  
export type UserToken = {
    balance: string | undefined;
    totalValueInUsd: string | undefined;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string | undefined;
    chainId: SupportedChainId;
    address: string;
    category?: RailgunWalletBalanceBucket; // used on private tokens only
    additionalInfo?: string;
    isBaseToken?: boolean;
}

export type Token = {
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string | undefined;
    chainId: SupportedChainId;
    address: string;
    additionalInfo?: string;
    isBaseToken?: boolean;
}

export type SendableToken = UserToken | Token;

export type TokenMetadata = {
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
}

