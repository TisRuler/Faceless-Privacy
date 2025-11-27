import { create } from "zustand";
import { SelectedBroadcaster } from "@railgun-community/shared-models";
import { BroadcasterConnectionStatus } from "@railgun-community/shared-models";
import { SendableToken } from "../shared/types";
import { getNetworkById } from "../shared/utils/network";
import { masterConfig } from "../config/masterConfig";

export type SendMethod = "SELF_SIGN" | "DEFAULT_BROADCASTER" | "CUSTOM_BROADCASTER";

type SendMethodSetter =
  | { method: "SELF_SIGN" | "DEFAULT_BROADCASTER"; broadcaster?: never }
  | { method: "CUSTOM_BROADCASTER"; broadcaster: SelectedBroadcaster };

// Main
interface BroadcasterStore {
  broadcasterConnectionStatus: BroadcasterConnectionStatus;
  setBroadcasterConnectionStatus: (value: BroadcasterConnectionStatus) => void;

  broadcasterFeeToken: SendableToken;
  setBroadcasterFeeToken: (token: SendableToken) => void;

  sendMethod: SendMethod;
  setSendMethod: (mode: SendMethodSetter) => void;
  customSelectedBroadcaster?: SelectedBroadcaster;

  defaultBroadcasterTxFailCount: number;
  resetDefaultBroadcasterTxFailCount: () => void
  increaseDefaultBroadcasterTxFailCount: () => void;
}

const configuredNetwork = getNetworkById(masterConfig.initialActiveNetwork.id);

export const useBroadcasterStore = create<BroadcasterStore>((set) => ({
  broadcasterConnectionStatus: BroadcasterConnectionStatus.Disconnected,
  setBroadcasterConnectionStatus: (value) => set({ broadcasterConnectionStatus: value }),

  broadcasterFeeToken: configuredNetwork.privateModeBaseToken,
  setBroadcasterFeeToken: (token) => set({ broadcasterFeeToken: token }),

  sendMethod: "DEFAULT_BROADCASTER",
  customSelectedBroadcaster: undefined,

  setSendMethod: (options: SendMethodSetter) => 
    set(() => {
      return {
        defaultBroadcasterTxFailCount: 0,
        sendMethod: options.method,
        customSelectedBroadcaster:
          options.method === "CUSTOM_BROADCASTER"
            ? options.broadcaster
            : undefined,
      };
    }),

  defaultBroadcasterTxFailCount: 0,
  resetDefaultBroadcasterTxFailCount: () => set({ defaultBroadcasterTxFailCount: 0 }),
  increaseDefaultBroadcasterTxFailCount: () => set((state) => ({ defaultBroadcasterTxFailCount: state.defaultBroadcasterTxFailCount + 1 })),

}));

