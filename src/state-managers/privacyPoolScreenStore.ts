import { create } from "zustand";

interface WalletModeScreentore {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const usePrivacyPoolScreenStore = create<WalletModeScreentore>((set) => ({
  isLoading: false,
  setIsLoading: (value) => set({isLoading: value}),
}));
