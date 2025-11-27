import { findBroadcastersForToken } from "./findBroadcastersForToken";
import { throwErrorWithTitle } from "../other";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { useBroadcasterStore } from "~~/src/state-managers";
import { SelectedBroadcaster } from "@railgun-community/shared-models";

const DEFAULT_RAILGUN_ADDRESS = "0zk1qy09dy4v0rngraluhyt726847trzdfahr9q27kh3csxygj3cuh55lrv7j6fe3z53l7xv6xxjnprk3aylejxmryfu5v4aw5rc8kka2z0t4t8neaqx48ucwlecevf";

// Helper
const pickRandomBroadcaster = (broadcasters: SelectedBroadcaster[]) => {
  const randomIndex = Math.floor(Math.random() * broadcasters.length);
  const selectedBroadcaster = broadcasters[randomIndex];

  return selectedBroadcaster;
};

// Main
export const getDefaultBroadcasterForToken = async () => {
  try {
    const broadcasters = await findBroadcastersForToken();

    if (!broadcasters || broadcasters.length === 0) {
      throw new Error("No broadcasters found for token");
    }
    
    const defaultBroadcasterTxFailCount = useBroadcasterStore.getState().defaultBroadcasterTxFailCount;

    // If 1 or more failures, pick a random broadcaster
    if (defaultBroadcasterTxFailCount > 0) {
      const randomlySelectedBroadcaster = pickRandomBroadcaster(broadcasters);
      return randomlySelectedBroadcaster;
    }

    const selectedBroadcaster = broadcasters.find(
      (b) => b.railgunAddress === DEFAULT_RAILGUN_ADDRESS
    );
    
    if (selectedBroadcaster) {
      return selectedBroadcaster;
    }

    // If there was 0 broadcaster tx fails and the go-to broadcaster is'nt online, pick a random one
    const randomlySelectedBroadcaster = pickRandomBroadcaster(broadcasters);
    return randomlySelectedBroadcaster;
  } catch (error) {
    throwErrorWithTitle(
      WALLET_MODE_NOTIFICATIONS.FINDING_DEFAULT_BROADCASTER_FOR_TOKEN_ERROR,
      error
    );
  }
};