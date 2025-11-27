import { logError } from "~~/src/shared/utils/other/logError";

export async function validateRpcUrl(rpcUrl: string, expectedChainId: number): Promise<{ valid: boolean; reason?: string }> {
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      }),
    });

    const data = await response.json();

    if (!data?.result) return { valid: false, reason: "No Result From RPC" };

    const chainId = parseInt(data.result, 16);
    if (isNaN(chainId)) return { valid: false, reason: "Invalid chain ID" };

    if (chainId !== expectedChainId) return { valid: false, reason: "Wrong Chain" };

    return { valid: true };
  } catch (error) {
    logError(error);
    return { valid: false, reason: "Fetch or JSON error" };
  }
}
