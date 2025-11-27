import axios from "axios";
import { ChainData } from "~~/src/config/chains/types";
import { withRetry } from "./withRetry";

const priceCache: Record<string, { value: number; timestamp: number }> = {};
const CACHE_DURATION = 3 * 60 * 1000;

export async function getCachedTokenPrice(
  network: ChainData,
  tokenAddress: string,
): Promise<number> {
  const lowercaseAddress = tokenAddress.toLowerCase();
  const cacheKey = `${network.id}-${lowercaseAddress}`;

  const contractData = network.popularTokenMetadata[lowercaseAddress];
  if (!contractData?.tokenPriceApi) return 0;

  const cached = priceCache[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.value;
  }

  const price = await withRetry(async () => {
    const response = await axios.get(contractData.tokenPriceApi);
    const priceData = response.data;

    if (
      typeof priceData === "object" &&
      priceData !== null &&
      Object.keys(priceData).length > 0
    ) {
      const tokenId = Object.keys(priceData)[0];
      const price = Number(priceData[tokenId]?.usd);
      if (!isNaN(price)) {
        priceCache[cacheKey] = { value: price, timestamp: Date.now() };
        return price;
      }
    }

    throw new Error("Malformed token price data");
  }, `getCachedTokenPrice -> ${contractData.tokenPriceApi}`);

  return price;
}
