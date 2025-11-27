import { Contract } from "ethers";
import ERC20Abi from "../../../assets/abis/ERCAbi.json";
import { getEthersProvider } from "../network";

const contractCache = new Map<string, Contract>();

const buildCacheKey = (chainId: number, address: string): string => {
  return `${chainId}-${address.toLowerCase()}`;
};

/** Get cached Contract or create and cache it */
export const getCachedEthersERC20Contract = async (chainId: number, address: string): Promise<Contract> => {
  const cacheKey = buildCacheKey(chainId, address);

  const cached = contractCache.get(cacheKey);
  if (cached) return cached;

  const provider = getEthersProvider();

  const contract = new Contract(address, ERC20Abi, provider);
  contractCache.set(cacheKey, contract);

  return contract;
};

/** Clear all cached contracts for a specific chain */
export const clearCachedEthersContractsByChainId = (chainId: number): void => {
  for (const key of contractCache.keys()) {
    if (key.startsWith(`${chainId}-`)) {
      contractCache.delete(key);
    }
  }
};