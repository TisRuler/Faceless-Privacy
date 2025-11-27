import { 
  JsonRpcProvider, 
  FallbackProvider, 
  TransactionResponse 
} from "ethers";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { withRetry } from "~~/src/shared/utils/tokens";

type ResilientInput = JsonRpcProvider | FallbackProvider | (JsonRpcProvider | FallbackProvider)[];

function isFallbackProvider(provider: any): provider is FallbackProvider {
  return "providerConfigs" in provider;
}

/** Flattens all FallbackProviders into plain JsonRpcProviders */
function extractAllProviders(input: ResilientInput): JsonRpcProvider[] {
  const flat: JsonRpcProvider[] = [];

  const process = (provider: JsonRpcProvider | FallbackProvider) => {
    if (isFallbackProvider(provider)) {
      provider.providerConfigs.forEach(config => process(config.provider as JsonRpcProvider));
    } else {
      flat.push(provider);
    }
  };  

  if (Array.isArray(input)) {
    input.forEach(provider => process(provider));
  } else {
    process(input);
  }

  return flat;
}

/** Resiliently fetch a transaction from providers, retrying on nulls + errorors */
export async function getTransactionWithResilientFallback(
  txid: string,
  input: ResilientInput
): Promise<TransactionResponse> {
  const providers = extractAllProviders(input);

  for (const provider of providers) {
    try {
      const tx = await withRetry(() => provider.getTransaction(txid), "provider.getTransaction(txid)");
      if (tx) return tx;
    } catch (error) {
      continue;
    }
  }

  throw new Error(GENERAL_NOTIFICATIONS.CHECK_PROVIDER);
}
