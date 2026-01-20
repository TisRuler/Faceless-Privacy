import { 
  INJECTED_WALLET_NOTIFICATIONS, 
  PRIVATE_ADDRESS_NOTIFICATIONS, 
  WALLET_MODE_NOTIFICATIONS, 
  GENERAL_NOTIFICATIONS, 
  RAILGUN_ENGINE_NOTIFICATIONS,
  SETTINGS_NOTIFICATIONS
} from "~~/src/constants/notifications";
import { isBalanceToLowError } from "~~/src/shared/utils/other/isBalanceToLowError";
import { isUserRejectionError } from "~~/src/shared/utils/other/isUserRejectionError";
import { isProviderError } from "./isProviderError";
import { isBroadcasterError } from "./isBroadcasterError";
import { isNoteAlreadySpentError } from "./isNoteAlreadySpentError";
import { useBroadcasterStore } from "~~/src/state-managers";
import { BroadcasterConnectionStatus } from "@railgun-community/shared-models";

export function getNotificationFromError(error: unknown, backupDefaultNotification?: string): string {

  if (isUserRejectionError(error)) {
    return GENERAL_NOTIFICATIONS.USER_REJECTION;
  }

  if (isProviderError(error)) {
    return GENERAL_NOTIFICATIONS.CHECK_PROVIDER;
  }
  
  if (isBalanceToLowError(error)) {
    return WALLET_MODE_NOTIFICATIONS.BALANCE_TOO_LOW;
  }

  if (isBroadcasterError(error)) {
    return getBroadcasterNofication();
  }

  if (isNoteAlreadySpentError(error)) {
    return WALLET_MODE_NOTIFICATIONS.ERROR_NOTES_ALREADY_SPENT;
  }

  if (error instanceof Error) {
    const allNotifications = {
      ...INJECTED_WALLET_NOTIFICATIONS,
      ...PRIVATE_ADDRESS_NOTIFICATIONS,
      ...WALLET_MODE_NOTIFICATIONS,
      ...GENERAL_NOTIFICATIONS,
      ...RAILGUN_ENGINE_NOTIFICATIONS,
      ...SETTINGS_NOTIFICATIONS,
    };
  
    const errorTitle =
    typeof (error as any).title === "string" ? (error as any).title : undefined;
    const errorText = errorTitle || error.message;
  
    const match = Object.values(allNotifications).find(
      (notice) => typeof notice === "string" && errorText.includes(notice)
    );
  
    if (match) return match;
  }
  
  // Fallback in case no match is found
  if (backupDefaultNotification) {
    return backupDefaultNotification;
  } else {
    return GENERAL_NOTIFICATIONS.BACKUP_ERROR;
  }
}

// Helper
const getBroadcasterNofication = () => {
  const sendMethod = useBroadcasterStore.getState().sendMethod;

  const broadcasterConnectionStatus = useBroadcasterStore.getState().broadcasterConnectionStatus;

  if (broadcasterConnectionStatus === BroadcasterConnectionStatus.Searching) {
    return "Try Again, Searching For a Broadcaster";
  }

  const isDefaultBroadcaster = sendMethod === "DEFAULT_BROADCASTER";
  const defaultBroadcasterTxFailCount = useBroadcasterStore.getState().defaultBroadcasterTxFailCount;

  if (isDefaultBroadcaster && defaultBroadcasterTxFailCount < 3) {
    return "Try Again, Broadcaster Failed";
  } else {
    return WALLET_MODE_NOTIFICATIONS.GENERAL_BROADCASTER_ERROR;
  }
};