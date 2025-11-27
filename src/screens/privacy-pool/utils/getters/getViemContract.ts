import { getContract as getUncachedContact } from "viem";
import { getPublicClient } from ".";
import { Address } from "viem";
import ERC20Abi from "~~/src/assets/abis/ERCAbi.json";

export const getViemContract = (address: string) => {
  const publicClient = getPublicClient();

  const contract = getUncachedContact({
    address: address as Address,
    abi: ERC20Abi,
    client: publicClient,
  });

  return contract;
};