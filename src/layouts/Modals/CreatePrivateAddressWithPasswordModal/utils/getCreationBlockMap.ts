import { NetworkName } from "@railgun-community/shared-models";
import { JsonRpcProvider } from "ethers";
import { DEFAULT_RPC_URLS } from "~~/src/config/defaultRpcUrls";
import { RpcState } from "~~/src/shared/enums";
import { getRpcStateForActiveNetwork } from "~~/src/shared/utils/network";

const fetchLatestBlock = async (provider: any) => {
  try {
    return await provider.getBlockNumber();
  } catch {
    return undefined;
  }
};

export const getCreationBlockMap = async () => {
  const rpcState = getRpcStateForActiveNetwork();
  
  if (rpcState == RpcState.Off) throw new Error ("RPC is off");

  const areAnyRPCsCustom = Object.values(rpcState === RpcState.Custom).some(Boolean);

  // Define providers based on `isRPCCustom`
  const ethProvider = areAnyRPCsCustom
    ? new JsonRpcProvider(undefined)
    : DEFAULT_RPC_URLS[1][0];
  
  const polygonProvider = areAnyRPCsCustom
    ? new JsonRpcProvider(undefined)
    : DEFAULT_RPC_URLS[137][0];
  
  const ethSepoliaProvider = areAnyRPCsCustom
    ? new JsonRpcProvider(undefined)
    : DEFAULT_RPC_URLS[11155111][0];
  
  const arbitrumProvider = areAnyRPCsCustom
    ? new JsonRpcProvider(undefined)
    : DEFAULT_RPC_URLS[42161][0];
  
  // Get latest block numbers
  const latestEthBlock = await fetchLatestBlock(ethProvider);
  const latestPolygonBlock = await fetchLatestBlock(polygonProvider);
  const latestEthSepoliaBlock = await fetchLatestBlock(ethSepoliaProvider);
  const latestArbBlock = await fetchLatestBlock(arbitrumProvider);
  
  // Map network names to block numbers
  const creationBlockNumberMap = {
    [NetworkName.Ethereum]: latestEthBlock,
    [NetworkName.EthereumSepolia]: latestEthSepoliaBlock,
    [NetworkName.Polygon]: latestPolygonBlock,
    [NetworkName.Arbitrum]: latestArbBlock,
  };
  
  return creationBlockNumberMap;
};