import { SupportedChainId } from "../shared/types";
import { GENERAL_NOTIFICATIONS } from "./notifications";
import { getTokenUri } from "../shared/utils/tokens";
import { ChainData } from "../config/chains/types";

// Used if there was a problem retrieving data
export const tokenDataFallback = (network: ChainData, address: string) => ({
  chainId: 1 as SupportedChainId,
  address,
  name: GENERAL_NOTIFICATIONS.CHECK_PROVIDER,
  symbol: "Issue Displaying Token",
  decimals: 18,
  logoURI: getTokenUri(network, address),
  balance: undefined,
  totalValueInUsd: undefined,
});
