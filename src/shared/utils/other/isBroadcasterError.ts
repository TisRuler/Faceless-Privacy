import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";

export function isBroadcasterError(error: unknown): boolean {
  if (!error) return false;
  

  const errorTitle =
  typeof (error as any).title === "string" ? (error as any).title : undefined;

  const broadcasterErrorTitles = (
    WALLET_MODE_NOTIFICATIONS.FINDING_DEFAULT_BROADCASTER_FOR_TOKEN_ERROR || 
    WALLET_MODE_NOTIFICATIONS.ERROR_FINDING_BROADCASTER || 
    WALLET_MODE_NOTIFICATIONS.GENERAL_BROADCASTER_ERROR
  );

  if (errorTitle === broadcasterErrorTitles) {
    return true;
  }

  const msg =
    typeof error === "string"
      ? error
      : (error as Error)?.message ?? "";
  
  return ["broadcaster.error", "error from broadcaster"].some(keyword =>
    msg.toLowerCase().includes(keyword)
  );
}