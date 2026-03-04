import { findBroadcastersForToken } from "./findBroadcastersForToken";
import { throwErrorWithTitle } from "../other";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { useBroadcasterStore } from "~~/src/state-managers";
import { SelectedBroadcaster } from "@railgun-community/shared-models";

const DEFAULT_RAILGUN_ADDRESS = "0zk1qyr6prgl0jdhp826nt8e56tq667la4zavwa5jzxe26g8fnqafd2f0rv7j6fe3z53ll0p6eyzhx87a98ed4dkhsx5r8cc0ggmqvt6wzqtgqsywq9tq4tnz5ra2ws";

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