import { isBroadcasterError } from "../other";
import { openSelectBroadcasterModal } from "~~/src/layouts/Modals/modalUtils";
import { useBroadcasterStore } from "~~/src/state-managers";

/* Notifications not handled with this, it sets up the flow for the next tx's */
export function processBroadcasterError(error: unknown) {
  if (!isBroadcasterError(error)) return;
  
  const sendMethod = useBroadcasterStore.getState().sendMethod;

  // Increase fail count
  if (sendMethod === "DEFAULT_BROADCASTER") {
    useBroadcasterStore.getState().increaseDefaultBroadcasterTxFailCount();
  }

  const defaultBroadcasterTxFailCount = useBroadcasterStore.getState().defaultBroadcasterTxFailCount;

  // If there are more than 2 default broadcaster failed tx's or the user used a custom broadcaster, open the broadcaster selection modal
  if (defaultBroadcasterTxFailCount > 2 || sendMethod === "CUSTOM_BROADCASTER") {
    openSelectBroadcasterModal();
  }
}