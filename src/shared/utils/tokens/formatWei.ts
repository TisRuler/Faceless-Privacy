import { formatUnits } from "viem";

export function formatWei(
  value: bigint | string,
  unit: "eth" | "gwei" = "eth",
  precision: number = 6
): string {
  const decimals = unit === "eth" ? 18 : 9;
  const formatted = formatUnits(BigInt(value), decimals);
  const [int, frac = ""] = formatted.split(".");
  return `${int}.${frac.slice(0, precision)}`.replace(/\.?0+$/, "");
}