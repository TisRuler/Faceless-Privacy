import { formatUnits, parseUnits } from "ethers";
import { Token, SendableToken } from "~~/src/shared/types";
import { FeeDataToDisplay } from "~~/src/screens/wallet-mode/types";

const GWEI_TO_WEI = 1_000_000_000n;
const RAILGUN_FEE_BASIS_POINTS = 25n; // 0.25%

/**
 * Main: calculates network fee, railgun fee, broadcaster fee, and total fee for private address display.
 */
export const calculateFeesToDisplay = async (
  amountOfTokensToSend: string,
  baseToken: Token,
  tokenToSend: SendableToken,
  isForTransfer: boolean,
  isUsingSelfSignMethod: boolean, 
  gasPriceInGwei: bigint, 
  unformattedBroadcasterFee: bigint | undefined, 
  gasEstimate: bigint, 
  broadcasterFeeToken: SendableToken,
): Promise<FeeDataToDisplay> => {
  try {
    // Validate inputs
    if (!amountOfTokensToSend || parseFloat(amountOfTokensToSend) <= 0) {
      throw new Error("Invalid amount of tokens to send");
    }
    if (gasPriceInGwei < 0n) {
      throw new Error("Invalid gas price");
    }
    if (gasEstimate < 0n) {
      throw new Error("Invalid gas estimate");
    }
 
    const areAllFeesUsingTheSameToken = tokenToSend.address === broadcasterFeeToken.address;

    const [networkFee, broadcasterFee, railgunFee] = await Promise.all([
      getNetworkFeeForDisplay(
        isUsingSelfSignMethod, 
        gasEstimate, 
        gasPriceInGwei, 
        baseToken,
      ),
      formatBroadcasterFeeForDisplay(
        isUsingSelfSignMethod,
        unformattedBroadcasterFee,
        broadcasterFeeToken,
      ),
      getRailgunFee(
        isForTransfer, 
        amountOfTokensToSend, 
        tokenToSend,
      )
    ]);

    const totalFee = await getTotalFee(
      areAllFeesUsingTheSameToken,
      isUsingSelfSignMethod, 
      railgunFee.amount,
      broadcasterFee.amount, 
      networkFee.amount,
      tokenToSend,
    );

    return { networkFee, railgunFee, broadcasterFee, totalFee, showTotalFee: areAllFeesUsingTheSameToken };
  } catch (error) {
    throw new Error(`Failed to calculate fees: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Returns the estimated network fee in base token currency as string
const getNetworkFeeForDisplay = async (
  isUsingSelfSignMethod: boolean, 
  gasEstimate: bigint, 
  gasPriceInGwei: bigint,
  baseToken: Token,
): Promise<{amount: string, token: Token}> => {
  if (!isUsingSelfSignMethod) return {amount: "0", token: baseToken};

  if (gasEstimate <= 0n || gasPriceInGwei <= 0n) {
    throw new Error("Invalid gas parameters for network fee calculation");
  }

  // Convert Gwei → Wei, then multiply by gas estimate
  const networkFeeInWei = gasEstimate * gasPriceInGwei * GWEI_TO_WEI;

  const amount = formatUnits(networkFeeInWei, baseToken.decimals); // Returns as string
  const token = baseToken;

  return { amount, token };
};

// Formats broadcaster fee for display as string
const formatBroadcasterFeeForDisplay = async (
  isUsingSelfSignMethod: boolean, 
  unformattedBroadcasterFee: bigint | undefined, 
  broadcasterFeeToken: SendableToken,
): Promise<{amount: string, token: SendableToken}> => {

  if (isUsingSelfSignMethod) return {amount:"0", token: broadcasterFeeToken};
  if (!unformattedBroadcasterFee || unformattedBroadcasterFee <= 0n) throw new Error("UnformattedBroadcasterFee should be larger than 0n");

  try {

    const amount = formatUnits(unformattedBroadcasterFee, broadcasterFeeToken.decimals);
    const token = broadcasterFeeToken;

    return {amount, token};
  } catch (error) {
    throw new Error(`Failed to get token decimals for broadcaster fee: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Calculates railgun fee as string
const getRailgunFee = async (
  isForTransfer: boolean,
  amountOfTokensToSend: string,
  tokenAddressToSend: SendableToken,
): Promise<{amount: string, token: SendableToken}> => {

  if (isForTransfer) return {amount: "0", token: tokenAddressToSend};

  const decimals = tokenAddressToSend.decimals;
  const feeBasisPoints = 25; // 0.25%
  
  // Convert token amount to base units using string manipulation
  const [integerPart, fractionalPart = ""] = amountOfTokensToSend.split(".");
  const fractionalPadded = fractionalPart.padEnd(decimals, "0").slice(0, decimals);
  const amountInBaseUnits = BigInt(integerPart + fractionalPadded);
  
  // Calculate fee in base units: (amount * 25) / 10000
  let feeBaseUnits = (amountInBaseUnits * BigInt(feeBasisPoints)) / 10000n;
  
  // Apply minimum fee of 1 base unit if needed
  if (feeBaseUnits === 0n && amountInBaseUnits > 0n) {
    feeBaseUnits = 1n;
  }
  
  // Convert back to token units as precise string
  const feeBaseString = feeBaseUnits.toString().padStart(decimals + 1, "0");
  const integer = feeBaseString.slice(0, -decimals) || "0";
  const fractional = feeBaseString.slice(-decimals).replace(/0+$/, "");
  
  const feeString = fractional.length > 0 ? `${integer}.${fractional}` : integer;
  
  return {
    amount: feeString,
    token: tokenAddressToSend
  };
};

// Calculates total fee by summing string amounts with precise math
const getTotalFee = (
  areAllFeesUsingTheSameToken: boolean,
  isUsingSelfSignMethod: boolean, 
  railgunFeeAmount: string,
  broadcasterFeeAmount: string, 
  networkFeeAmount: string,
  tokenToSend: SendableToken,
): {amount: string, token: SendableToken} | undefined => {
  try {
    
    if (!areAllFeesUsingTheSameToken) return undefined;

    // Convert all fee strings to bigint for precise addition
    const railgunFeeWei = parseUnits(railgunFeeAmount, tokenToSend.decimals);
    const broadcasterFeeWei = parseUnits(broadcasterFeeAmount, tokenToSend.decimals);
    const networkFeeWei = parseUnits(networkFeeAmount, tokenToSend.decimals);

    const totalFeeWei = isUsingSelfSignMethod 
      ? networkFeeWei + railgunFeeWei
      : broadcasterFeeWei + railgunFeeWei;

    const amount = formatUnits(totalFeeWei, tokenToSend.decimals);
    const token = tokenToSend;

    return { amount, token };

  } catch (error) {
    throw new Error(`Failed to calculate total fee: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};