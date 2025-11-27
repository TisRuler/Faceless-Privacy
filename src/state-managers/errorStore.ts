import { create } from "zustand";

export type LoggedError = {
  message: string
  title?: string
  stack?: string
}

type ErrorStore = {
  errors: LoggedError[]
  logError: (error: unknown) => void
  clearErrors: () => void
}

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: [],
  logError: (error) => {
    const normalized = normalizeError(error);

    set((state) => {
      const updated = [normalized, ...state.errors].slice(0, 20);
      return { errors: updated };
    });
  },
  clearErrors: () => set({ errors: [] }),
}));

function normalizeError(error: unknown): LoggedError {
  let message = "Unknown error";
  let stack: string | undefined;
  let title: string | undefined;

  if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
    title = (error as any).title ?? message;
  } else if (typeof error === "string") {
    message = error;
    title = error;
  } else if (typeof error === "object" && error !== null) {
    message = "message" in error && typeof (error as any).message === "string"
      ? (error as any).message
      : message;
    stack = "stack" in error && typeof (error as any).stack === "string"
      ? (error as any).stack
      : undefined;
    title = "title" in error && typeof (error as any).title === "string"
      ? (error as any).title
      : message;
  }

  return { message, stack, title };
}
