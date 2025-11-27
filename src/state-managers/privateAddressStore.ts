import { create } from "zustand";
import { UserToken } from "../shared/types";

interface PrivateAddressStore {
  privateAddressBalanceScanPercentage: string;
  setPrivateAddressBalanceScanPercentage: (value: string) => void;

  txidMerkletreeScanPercentage: string;
  setTxidMerkletreeScanPercentage: (value: string) => void;

  yourPrivateAddress: string;
  railgunWalletId: string;

  spendablePrivateTokens: UserToken[];
  setSpendablePrivateTokens: (value: UserToken[]) => void;

  nonSpendablePrivateTokens: UserToken[];
  setNonSpendablePrivateTokens: (value: UserToken[]) => void;

  pendingPrivateTokens: UserToken[];
  setPendingPrivateTokens: (value: UserToken[]) => void;

  loadPrivateAddressHistoryTriggerListener: number;
  setLoadPrivateAddressHistoryTriggerListener: (value: number) => void;
}

export const usePrivateAddressStore = create<PrivateAddressStore>((set) => ({

  privateAddressBalanceScanPercentage: "",
  setPrivateAddressBalanceScanPercentage: (value: string) => set({ privateAddressBalanceScanPercentage: value }),

  txidMerkletreeScanPercentage: "",
  setTxidMerkletreeScanPercentage: (value: string) => set({ txidMerkletreeScanPercentage: value }),

  yourPrivateAddress: "",

  railgunWalletId: "",

  spendablePrivateTokens: [],
  setSpendablePrivateTokens: (value: UserToken[]) => set({ spendablePrivateTokens: value }),

  nonSpendablePrivateTokens: [],
  setNonSpendablePrivateTokens: (value: UserToken[]) => set({ nonSpendablePrivateTokens: value }),

  pendingPrivateTokens: [],
  setPendingPrivateTokens: (value: UserToken[]) => set({ pendingPrivateTokens: value }),

  loadPrivateAddressHistoryTriggerListener: 0,
  setLoadPrivateAddressHistoryTriggerListener: (value: number) => set({ loadPrivateAddressHistoryTriggerListener: value }),

}));
