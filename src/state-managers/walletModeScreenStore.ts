import { create } from "zustand";
import { getNetworkById } from "~~/src/shared/utils/network";
import { masterConfig } from "../config/masterConfig";
import { FeeDataToDisplay } from "~~/src/screens/wallet-mode/types";
import { PublicModeDestination, PrivateModeDestination } from "~~/src/shared/enums";
import { SendableToken } from "../shared/types";

interface WalletModeScreentore {

  // Shared 
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  amount: string,
  setAmount: (value: string) => void;
  isNonModalWalletActionRequired: boolean;
  setIsNonModalWalletActionRequired: (value: boolean) => void;
  
  // Public flow
  publicModeTxHash: string;
  setPublicModeTxHash: (value: string) => void;
  publicModeDestination: PublicModeDestination;
  setPublicModeDestination: (destination: PublicModeDestination) => void;
  tokenForPublicMode: SendableToken;
  setTokenForPublicMode: (token: SendableToken) => void;

  // Private flow
  isDisplayingCommonPrivateModeAmounts: boolean;
  setIsDisplayingCommonPrivateModeAmounts: (value: boolean) => void;
  privateModeTxHash: string;
  setPrivateModeTxHash: (value: string) => void;
  feeDataToDisplay?: FeeDataToDisplay
  setFeeDataToDisplay: (value: FeeDataToDisplay) => void;
  privateModeDestination: PrivateModeDestination;
  setPrivateModeDestination: (destination: PrivateModeDestination) => void;
  tokenForPrivateMode: SendableToken;
  setTokenForPrivateMode: (token: SendableToken) => void;
  isTransactionInProgress: boolean;
  setIsTransactionInProgress: (value: boolean) => void;
}

const configuredNetwork = getNetworkById(masterConfig.initialActiveNetwork.id);

export const useWalletModeScreenStore = create<WalletModeScreentore>((set) => ({

  // Shared 
  recipientAddress: "",
  setRecipientAddress: (receiver) => set({ recipientAddress: receiver }),
  amount: "0",
  setAmount: (amount) => set({ amount: amount }),
  isNonModalWalletActionRequired: false,
  setIsNonModalWalletActionRequired: (value) => set({ isNonModalWalletActionRequired: value }),

  // Public flow
  publicModeTxHash: "",
  setPublicModeTxHash: (value) => set({ publicModeTxHash: value }),
  publicModeDestination: PublicModeDestination.ConnectedPrivateAddress,
  setPublicModeDestination : (value) => set({ publicModeDestination: value }),

  tokenForPublicMode: configuredNetwork.publicModeBaseToken,
  setTokenForPublicMode: (token) => set({ tokenForPublicMode: token }),

  // Private flow
  privateModeTxHash: "",
  setPrivateModeTxHash: (value) => set({ privateModeTxHash: value }),
  isDisplayingCommonPrivateModeAmounts: false,
  setIsDisplayingCommonPrivateModeAmounts: (value) => set({ isDisplayingCommonPrivateModeAmounts: value }),
  feeDataToDisplay: undefined,
  setFeeDataToDisplay: (value) => set({ feeDataToDisplay: value }),
  privateModeDestination: PrivateModeDestination.PublicAddress,
  setPrivateModeDestination : (value) => set({ privateModeDestination: value }),
  tokenForPrivateMode: configuredNetwork.privateModeBaseToken,
  setTokenForPrivateMode: (token) => set({ tokenForPrivateMode: token }),
  isTransactionInProgress: false,
  setIsTransactionInProgress: (value) => set({isTransactionInProgress: value}),
}));
