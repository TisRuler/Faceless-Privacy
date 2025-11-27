import { validateEthAddress } from "@railgun-community/wallet";

export function validatePrivateModeFee(
  isUsingSelfSignMethod: boolean, 
  broadcasterFeeTokenAddress: string, 
  privateModeBaseTokenAdddres: string
): void {

  const isPrivateModeFeeTokenBaseToken = broadcasterFeeTokenAddress === privateModeBaseTokenAdddres;
    
  const isValid = isUsingSelfSignMethod
    ? isPrivateModeFeeTokenBaseToken
    : validateEthAddress(broadcasterFeeTokenAddress);

  if (!isValid) {
    throw new Error("Fee Address Mismatch");
  }
}