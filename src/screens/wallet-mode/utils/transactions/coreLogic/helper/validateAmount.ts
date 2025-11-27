import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";

export function validateAmount(amount: string): void {
  const cleaned = amount.trim();

  if (cleaned.length === 0) {
    throw new Error(WALLET_MODE_NOTIFICATIONS.ERROR_INVALID_AMOUNT);
  }

  // 2. STRICT REGEX: Only allows:
  //    - "0" 
  //    - "123" (no leading zeros)
  //    - "0.456" or "789.123" (optional decimal)
  const validNumberPattern = /^(0|[1-9]\d*)(\.\d+)?$/;

  if (!validNumberPattern.test(cleaned)) {
    throw new Error(WALLET_MODE_NOTIFICATIONS.ERROR_INVALID_AMOUNT);
  }

  // 3. SAFETY: Parse as float (now safe since letters/scientific notation are blocked)
  const numeric = parseFloat(cleaned);

  if (isNaN(numeric) || numeric <= 0) {
    throw new Error(WALLET_MODE_NOTIFICATIONS.ERROR_INVALID_AMOUNT);
  }
}