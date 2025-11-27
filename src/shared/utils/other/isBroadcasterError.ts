export function isBroadcasterError(error: unknown): boolean {
  if (!error) return false;
  
  const msg =
      typeof error === "string"
        ? error
        : (error as Error)?.message ?? "";
  
  return ["broadcaster.error", "error from broadcaster"].some(keyword =>
    msg.toLowerCase().includes(keyword)
  );
}