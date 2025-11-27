export function isBalanceToLowError(error: unknown): boolean {
  if (!error) return false;

  const msg =
    typeof error === "string"
      ? error
      : (error as Error)?.message ?? "";

  return [
    "private balance too low", 
    "requires additional utxos to satisfy spending solution", 
    "insufficient funds"
  ].some(keyword =>
    msg.toLowerCase().includes(keyword)
  );
}