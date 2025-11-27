export function isProviderError(err: unknown): boolean {
  if (!err) return false;
  
  const msg =
      typeof err === "string"
        ? err
        : (err as Error)?.message ?? "";
  
  return ["cors", "403 forbidden", "failed to fetch"].some(keyword =>
    msg.toLowerCase().includes(keyword)
  );
}