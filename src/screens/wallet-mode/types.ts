import { TransactionGasDetails, Chain, SelectedBroadcaster, RailgunERC20AmountRecipient, RailgunERC20Amount, NetworkName, TXIDVersion } from "@railgun-community/shared-models";
import { Token, SendableToken, UserToken } from "~~/src/shared/types";
import { FallbackProvider, Provider } from "ethers";

export interface DataForBaseTokenSubmission {
  transactionGasDetails: TransactionGasDetails | undefined;
  selectedBroadcaster: SelectedBroadcaster | undefined;
  broadcasterFeeRaw: bigint | undefined;
  baseTokenAmount: RailgunERC20Amount | undefined;
}
  
export interface DataForPrivateModeTxSubmission {
  transactionGasDetails: TransactionGasDetails | undefined;
  selectedBroadcaster: SelectedBroadcaster | undefined;
  broadcasterFeeRaw?: bigint | undefined;
  erc20AmountRecipients?: RailgunERC20AmountRecipient[];
  broadcasterFeeERC20AmountRecipient?: RailgunERC20AmountRecipient | undefined;
}

export type FeeDataToDisplay = 
  | {
      broadcasterFee: {amount: string, token: SendableToken};
      railgunFee: {amount: string, token: SendableToken};
      networkFee: {amount: string, token: SendableToken};
      totalFee: {amount: string, token: SendableToken} | undefined;
      showTotalFee: boolean;
    }
  | undefined;

export type FeeData = 
  | {
      broadcasterFee: number;
      networkFee: number;
      totalFee: number;
    }
  | undefined;

type CorePrivateModeActionParams = {
  network: NetworkName;
  txIDVersion: TXIDVersion.V2_PoseidonMerkle;
  railgunWalletId: string;
  isUsingSelfSignMethod: boolean;

  setIsTransactionInProgress: (value: boolean) => void;
  setPrivateModeActionButtonText: (text: string) => void;
  resetActionState: () => void;
};

export type SharedEstimateParams = { 
  corePrivateModeActionParams: CorePrivateModeActionParams;
  broadcasterFeeToken: Token | UserToken,
  recipientAddress: string;
  amount: string;
  gasChoiceDefault: boolean; 
  customGweiAmount: number;
}

export type SharedSubmitParams = { 
  corePrivateModeActionParams: CorePrivateModeActionParams;
  railgunChain: Chain;
  progressCallback: (progress: number) => void;
  provider: Provider | FallbackProvider;
}