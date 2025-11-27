// Formats large token quantities into human-readable strings (e.g., 1100 → 1.1K, 2,000,000 → 2M)
export const formatAnonymitySetTokenQuantity = (tokenQuantity: string): string => {
  const numericQuantity = parseFloat(String(tokenQuantity));

  const format = (divisor: number, suffix: string) => {
    const formatted = (Math.floor((numericQuantity / divisor) * 1000) / 1000).toFixed(3).slice(0, -1);
    const isExact = numericQuantity === divisor;
    const endsWithDoubleZero = formatted.endsWith("00");
    return isExact || endsWithDoubleZero
      ? `${parseInt(formatted)}${suffix}`
      : `${formatted}${suffix}`;
  };

  if (numericQuantity >= 1e12) return format(1e12, "T");
  if (numericQuantity >= 1e9)  return format(1e9, "B");
  if (numericQuantity >= 1e6)  return format(1e6, "M");
  if (numericQuantity >= 1e3)  return format(1e3, "K");
  if (numericQuantity < 0.01)  return "< 0.01";

  return (Math.floor(numericQuantity * 100) / 100).toFixed(3).slice(0, -1);
};