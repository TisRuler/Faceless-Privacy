import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";

export const isUserRejectionError = (rawError: unknown): boolean => {
  if (rawError instanceof Error && rawError.message === GENERAL_NOTIFICATIONS.USER_REJECTION) return true;

  if (rawError && typeof rawError === "object") {
    const error = rawError as { code?: number; message?: string };

    return (
      error.code === 4001 ||
      (typeof error.message === "string" && error.message.toLowerCase().includes("user rejected"))
    );

  }

  return false;
};