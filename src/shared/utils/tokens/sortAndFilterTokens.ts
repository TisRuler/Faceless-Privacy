import { UserToken } from "~~/src/shared/types";

export function sortAndFilterTokens(tokens: UserToken[]): UserToken[] {
  const filtered = tokens.filter(token => {
    if (!token) return false;

    const balance = token.balance;
    if (balance === undefined || balance === null) return true; // keep undefined/null balances

    const parsed = parseFloat(balance.trim());
    return !isNaN(parsed) && parsed > 0; // remove 0 or negative balances
  });

  const sorted = [...filtered].sort((a, b) => {
    const aHasDefinedBalance = a.balance !== undefined && a.balance !== null;
    const bHasDefinedBalance = b.balance !== undefined && b.balance !== null;

    // Defined balances first
    if (aHasDefinedBalance !== bHasDefinedBalance) {
      return aHasDefinedBalance ? -1 : 1;
    }

    // Tokens with logoURI first
    const logoComparison = Number(Boolean(b.logoURI)) - Number(Boolean(a.logoURI));
    if (logoComparison !== 0) return logoComparison;

    // Descending totalValueInUsd
    const aValue = parseFloat(a.totalValueInUsd || "0");
    const bValue = parseFloat(b.totalValueInUsd || "0");
    return bValue - aValue;
  });

  return sorted;
}
