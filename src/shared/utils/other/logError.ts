import { useErrorStore } from "~~/src/state-managers";

export function logError(error: unknown) {
  useErrorStore.getState().logError(error);
}
  