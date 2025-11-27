import { BrowserProvider, JsonRpcSigner } from "ethers";
import { Client, Transport, Chain, Account } from "viem";
import { getWalletClient } from "wagmi/actions";
import { useSettingsStore } from "~~/src/state-managers";

/**
 * Converts a viem Wallet Client to an ethers.js Signer.
 * @param client - The viem Client to be converted.
 * @returns ethers.js Signer
 */
export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new BrowserProvider(transport, network);
  return new JsonRpcSigner(provider, account.address);
}

/**
 * Utility function to get your Public Wallets Signer based on the client and chainId.
 * @returns ethers.js Signer or undefined if client is missing.
 */
export const getPublicWalletSigner = async () => {
  const wagmiConfig = useSettingsStore.getState().wagmiConfig;
  const client = await getWalletClient(wagmiConfig);

  return clientToSigner(client);
};
