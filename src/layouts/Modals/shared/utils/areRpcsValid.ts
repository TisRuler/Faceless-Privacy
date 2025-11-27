import { toast } from "react-hot-toast";
import { validateRpcUrl } from "./validateRpcUrl";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { SupportedChainId } from "~~/src/shared/types";

export async function areRpcsValid(rpcUrls: string[], expectedChainId: SupportedChainId): Promise<boolean> {
  const results = await Promise.all(
    rpcUrls.map((url, i) =>
      validateRpcUrl(url, expectedChainId).then(res => ({ ...res, index: i }))
    )
  );

  const invalid = results.filter(r => !r.valid);

  if (rpcUrls.length > 1) {
    invalid.forEach(({ index, reason }) => {
      toast.error(`RPC ${index + 1} Failed: ${reason}`);
    });
  } else {
    toast.error(GENERAL_NOTIFICATIONS.CHECK_PROVIDER);
  }

  if (invalid.length > 0) {
    return false;
  }

  return true;
}

export async function filterForValidDefaultRpcs(rpcUrls: string[], expectedChainId: SupportedChainId): Promise<string[]> {
  const results = await Promise.all(
    rpcUrls.map((url, i) =>
      validateRpcUrl(url, expectedChainId).then(res => ({ ...res, index: i, url }))
    )
  );

  const validRpcs = results
    .filter(r => r.valid)
    .map(r => r.url);
    
  if (validRpcs.length < 2) {
    throw new Error("RPC's Down, Use Custom");
  }

  return validRpcs;
}

export async function filterForValidCustomRpcs(rpcUrls: string[], expectedChainId: SupportedChainId): Promise<string[]> {
  const results = await Promise.all(
    rpcUrls.map((url, i) =>
      validateRpcUrl(url, expectedChainId).then(res => ({ ...res, index: i }))
    )
  );

  const invalid = results.filter(r => !r.valid);

  if (rpcUrls.length > 1) {
    invalid.forEach(({ index, reason }) => {
      toast.error(`RPC ${index + 1} Failed: ${reason}`);
    });
  } else {
    toast.error(GENERAL_NOTIFICATIONS.CHECK_PROVIDER);
  }

  if (invalid.length > 0) {
    throw new Error(GENERAL_NOTIFICATIONS.CHECK_PROVIDER);
  }
  return rpcUrls;
}