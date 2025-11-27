import { isValidTokenInfo, sortAndFilterTokens } from "~~/src/shared/utils/tokens";
import { getEthersProvider } from "~~/src/shared/utils/network";
import { usePublicWalletStore, ConnectorRoles } from "~~/src/state-managers";
import { UserToken } from "~~/src/shared/types";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { fetchPublicAddressTokenData, enforceAccountSwitch, getPublicBaseTokenBalance } from "~~/src/shared/utils/wallet";
import { ChainData } from "~~/src/config/chains/types";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";
import { logError } from "~~/src/shared/utils/other/logError";

// Updates global state with public wallet tokens
export const refreshPublicAddressBalances = async (activeNetwork: ChainData) => {
  const isLoadingPublicWalletTokens = usePublicWalletStore.getState().isLoadingPublicWalletTokens;
  if (isLoadingPublicWalletTokens) return;

  try {
    const { address } =  await enforceAccountSwitch(ConnectorRoles.PUBLIC);
    await updatePublicWalletBalances(address, activeNetwork);
  } catch (error) {
    logError(error);
  }
};

const updatePublicWalletBalances = async (userAddress: string, network: ChainData) => {
  const { setTokensInPublicWallet, setIsLoadingPublicWalletTokens } = usePublicWalletStore.getState();
  
  setIsLoadingPublicWalletTokens(true);

  try {
    const tokens = await fetchTokensForUser(userAddress, network);
    setTokensInPublicWallet(tokens);
  } catch (error) {
    throwErrorWithTitle(GENERAL_NOTIFICATIONS.CHECK_PROVIDER, error);
  } finally {
    setIsLoadingPublicWalletTokens(false);
  }
};

// Helper:
// Uses a pre-defined popular token address list to check if the user has any balances related to them, 
// Then get's the base token balance, and filters the result.
const fetchTokensForUser = async (userAddress: string, network: ChainData): Promise<UserToken[]> => {
  
  const provider = getEthersProvider();

  const tokens = network.defaultShieldingTokensList;

  const erc20Tokens = await Promise.all(
    tokens.map(async (token) => {
      return await fetchPublicAddressTokenData(network, token.address, userAddress);
    })
  );

  const baseToken = await getPublicBaseTokenBalance(network, provider, userAddress);

  const all = [...erc20Tokens, baseToken].filter(isValidTokenInfo);
  return sortAndFilterTokens(all);
};