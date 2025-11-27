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
import { masterConfig } from "~~/src/config/masterConfig";

export const startBroadcasterClient = async () => {
  const setBroadcasterConnectionStatus = useBroadcasterStore.getState().setBroadcasterConnectionStatus;
  const activeNetwork = getActiveNetwork();

  const pubSubTopic = masterConfig.pubSubTopic;
  const additionalDirectPeers: string[] = [];
  const peerDiscoveryTimeout = masterConfig.peerDiscoveryTimeout;

  const broadcasterOptions: BroadcasterOptions = {
    pubSubTopic,
    additionalDirectPeers,
    peerDiscoveryTimeout,
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
