import { LoggedError } from "~~/src/state-managers/errorStore";

export function throwErrorWithTitle(title: string, error: unknown): never {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error != null) {
    try {
      message = JSON.stringify(error);
    } catch {
      message = "Unserializable error";
    }
  } else {
    message = "Unknown error";
  }

  const err = new Error(message, { cause: error as any })
  ;(err as LoggedError).title = title;

  throw err;
}