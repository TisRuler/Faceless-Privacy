import {
  WakuBroadcasterClient,
  BroadcasterConnectionStatusCallback,
  BroadcasterDebugger,
  BroadcasterOptions,
} from "@railgun-community/waku-broadcaster-client-web";
import { Chain, BroadcasterConnectionStatus } from "@railgun-community/shared-models";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { useBroadcasterStore } from "~~/src/state-managers";
import { logError } from "../other/logError";

export const startBroadcasterClient = async () => {
  const setBroadcasterConnectionStatus = useBroadcasterStore.getState().setBroadcasterConnectionStatus;
  const activeNetwork = getActiveNetwork();

  const trustedFeeSigner = "0zk1qyzgh9ctuxm6d06gmax39xutjgrawdsljtv80lqnjtqp3exxayuf0rv7j6fe3z53laetcl9u3cma0q9k4npgy8c8ga4h6mx83v09m8ewctsekw4a079dcl5sw4k";

  const broadcasterOptions: BroadcasterOptions = {
    trustedFeeSigner
  };

  const statusCallback: BroadcasterConnectionStatusCallback = (
    chain: Chain,
    status: BroadcasterConnectionStatus
  ) => {
    
    const previousBroadcasterStatus = useBroadcasterStore.getState().broadcasterConnectionStatus;
    
    if (status !== previousBroadcasterStatus) {
      setBroadcasterConnectionStatus(status);
    }
  };

  const broadcasterDebugger: BroadcasterDebugger = {
    log: (msg: string) => {
      // noop: non error logs intentionally suppressed
    },
    error: (error: Error) => {
      logError(error);
    },
  };

  try {
    setBroadcasterConnectionStatus(BroadcasterConnectionStatus.Searching);
    await WakuBroadcasterClient.start(
      activeNetwork.railgunChain,
      broadcasterOptions,
      statusCallback,
      broadcasterDebugger
    );
  } catch (error) {
    setBroadcasterConnectionStatus(BroadcasterConnectionStatus.Error);
    logError(error);
  }
};
