export function isNoteAlreadySpentError(error: unknown): boolean {
  if (!error) return false;
  
  const msg =
      typeof error === "string"
        ? error
        : (error as Error)?.message ?? "";
  
  return ["note already spent"].some(keyword =>
    msg.toLowerCase().includes(keyword)
  );
}