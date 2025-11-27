import { SendableToken } from "~~/src/shared/types";
import { parseUnits, formatUnits } from "ethers";

export const getAmountWithRailgunFee = (
  isNoRailgunFeeNeeded: boolean,
  amount: string,
  tokenToSend: SendableToken,
) => {
  if (isNoRailgunFeeNeeded) {
    return amount; // No fee for public to public tx's
  }
  
  const amountWei = parseUnits(amount, tokenToSend.decimals);
    
  // Calculate the amount needed so that after 0.25% fee, destination gets exactly 'amount'
  // Formula: amountToSend = desiredAmount / (1 - 0.0025)
  // In basis points: amountToSend = desiredAmount / (1 - 25/10000)
  const amountToSendWei = (amountWei * 10000n) / 9975n;
    
  return formatUnits(amountToSendWei, tokenToSend.decimals);
};