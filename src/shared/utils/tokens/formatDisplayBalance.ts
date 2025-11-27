/**
 * Formats a number or decimal string for display purposes.
 * 
 * Strict behavior:
 * - Accepts only numbers or plain decimal strings (no exponential notation like "1e4").
 * - Returns "not calculated" for invalid inputs.
 * - Handles tiny numbers with thresholds to avoid clutter.
 * - Limits decimal places for readability.
 * 
 * @param value - The number or decimal string to format.
 * @param showXsLength - Optional flag to adjust decimal threshold and max decimals.
 *                        true: threshold 0.0001, max decimals 4
 *                        false: threshold 0.000001, max decimals 6
 * @returns Formatted string suitable for UI display.
 */
export const formatDisplayNumber = (
  value: number | string,
  showXsLength = false
): string => {
  // Threshold below which numbers are shown as "< threshold" for readability
  const displayThreshold = showXsLength ? 0.0001 : 0.000001;
  
  let num: number;
  
  // STRICT parsing: only accept valid numbers or decimal strings
  if (typeof value === "number") {
    num = value;
  } else if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value)) {
    // Only decimal strings allowed; rejects "1e4", "abc", etc.
    num = parseFloat(value);
  } else {
    return "not calculated"; // Invalid input
  }
  
  // Reject NaN, Infinity, -Infinity
  if (!isFinite(num)) return "not calculated";
  
  // Handle exact zero
  if (num === 0) return "0";
  
  // Handle very small numbers under threshold
  if (Math.abs(num) < displayThreshold) {
    return num < 0 ? `< -${displayThreshold}` : `< ${displayThreshold}`;
  }
  
  // Convert number to string for decimal formatting
  const [intPart, decPart] = num.toString().split(".");
  
  if (decPart) {
    // Limit decimals for readability (4 or 6 depending on flag)
    const maxDecimals = showXsLength ? 4 : 6;
    return `${intPart}.${decPart.slice(0, maxDecimals)}`.replace(/\.?0+$/, "");
  }
  
  // If no decimals, just return integer part
  return num.toString();
};
  