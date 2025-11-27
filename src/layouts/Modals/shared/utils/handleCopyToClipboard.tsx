import toast from "react-hot-toast";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { logError } from "~~/src/shared/utils/other/logError";

export async function handleCopyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(GENERAL_NOTIFICATIONS.COPIED_TO_CLIPBOARD);
  } catch (error) {
    logError(error);
  }
}
