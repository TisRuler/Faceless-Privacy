import { create } from "zustand";

interface UiStore {
  txCelebrationListener: number;
  triggerTxCelebration: () => void;
  hasDisplayedIntro: boolean;
  setHasDisplayedIntro: (value: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  txCelebrationListener: 0,
  triggerTxCelebration: () =>
    set((state) => ({ txCelebrationListener: state.txCelebrationListener + 1 })),

    hasDisplayedIntro: false,
    setHasDisplayedIntro: (value) => set({hasDisplayedIntro: value}),
}));
