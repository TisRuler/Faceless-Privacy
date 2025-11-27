import { create } from "zustand";

interface UiStore {
  txCelebrationListener: number;
  triggerTxCelebration: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  txCelebrationListener: 0,
  triggerTxCelebration: () =>
    set((state) => ({ txCelebrationListener: state.txCelebrationListener + 1 })),
}));
