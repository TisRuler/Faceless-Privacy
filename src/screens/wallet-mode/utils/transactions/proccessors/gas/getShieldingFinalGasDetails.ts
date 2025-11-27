import { EVMGasType, TransactionGasDetails, getEVMGasTypeForTransaction, NetworkName } from "@railgun-community/shared-models";
import { parseUnits } from "ethers";
import { getBaseGasFees } from "./getBaseGasFees";
import { FallbackProvider, JsonRpcProvider } from "ethers";
import { getActiveNetwork } from "~~/src/shared/utils/network";

export async function getShieldingFinalGasDetails(
  network: NetworkName,
  gasEstimate: bigint,
  gasChoiceDefault: boolean,
  customGweiAmount: number,
  provider: JsonRpcProvider | FallbackProvider,
): Promise<TransactionGasDetails> {
  
  const { supportsEIP1559 } = getActiveNetwork();

  const { 
    gasPriceInGwei, 
    maxFeePerGasInWei, 
    maxPriorityFeePerGasInWei 
  } = await getBaseGasFees(
    gasChoiceDefault, 
    customGweiAmount, 
    supportsEIP1559, 
    provider
  );

  const evmGasType = getEVMGasTypeForTransaction(network, true); // Always true for shielding

  switch (evmGasType) {
  case EVMGasType.Type0:
  case EVMGasType.Type1:
    return {
      evmGasType,
      gasEstimate,
      gasPrice: parseUnits(String(gasPriceInGwei), "gwei"), // Handle gasPrice directly
    };
  
  case EVMGasType.Type2:
    return {
      evmGasType,
      gasEstimate,
      maxFeePerGas: maxFeePerGasInWei,
      maxPriorityFeePerGas: maxPriorityFeePerGasInWei,
    };
  
  default:
    throw new Error(`Unsupported EVM gas type: ${evmGasType}`);
  }
}