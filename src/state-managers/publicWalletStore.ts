import { create } from "zustand";
import { UserToken } from "../shared/types";

interface PublicWalletStore {
  tokensInPublicWallet: UserToken[];
  setTokensInPublicWallet: (tokensInPublicWallet: UserToken[]) => void;
  addTokenToPublicWallet: (token: UserToken) => void;
  isLoadingPublicWalletTokens: boolean;
  setIsLoadingPublicWalletTokens: (value: boolean) => void;
}

export const usePublicWalletStore = create<PublicWalletStore>((set) => ({

  tokensInPublicWallet: [],
  setTokensInPublicWallet: (tokensInPublicWallet) => set({ tokensInPublicWallet }),
  
  addTokenToPublicWallet: (token) =>
    set((state) => {
      if (state.tokensInPublicWallet.some((t) => t.address === token.address)) {
        return state; // avoid duplicate tokens
      }
      return { tokensInPublicWallet: [...state.tokensInPublicWallet, token] };
    }),
  
  isLoadingPublicWalletTokens: false,
  setIsLoadingPublicWalletTokens: (isLoadingPublicWalletTokens) => set({ isLoadingPublicWalletTokens }),

}));