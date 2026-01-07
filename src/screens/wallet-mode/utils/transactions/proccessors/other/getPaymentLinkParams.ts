import { validateRailgunAddress } from "@railgun-community/wallet";

export function getPaymentLinkParams() {
    if (typeof window === "undefined") {
      return { valid: false };
    }
  
    let parsedUrl: URL;
  
    try {
      parsedUrl = new URL(window.location.href);
    } catch {
      return { valid: false };
    }
  
    const recipientRailgunAddress = parsedUrl.searchParams.get("pay-private-address");
    const recipientName = parsedUrl.searchParams.get("nickname");

    if (!recipientRailgunAddress || !recipientName) return { valid: false };

    if (!validateRailgunAddress(recipientRailgunAddress)) return { valid: false };
  
    return {
      valid: true,
      recipientRailgunAddress,
      recipientName,
    };
};