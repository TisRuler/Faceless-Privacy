import { unloadWalletByID } from "@railgun-community/wallet";
import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { 
  usePrivateAddressStore, 
  useConnectorRolesStore,
  ConnectorRoles,
} from "~~/src/state-managers";

export const disconnectPrivateAddress = async () => {
  const railgunWalletId = usePrivateAddressStore.getState().railgunWalletId;

  if (!railgunWalletId) throw new Error(PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_ID_NOT_FOUND_IN_STORAGE); 

  await unloadWalletByID(railgunWalletId);

  // Clear states
  usePrivateAddressStore.setState({
    railgunWalletId: "",
    yourPrivateAddress: "",
    spendablePrivateTokens: [],
    nonSpendablePrivateTokens: [],
    pendingPrivateTokens: [],
  });

  useConnectorRolesStore.getState().clearRole(ConnectorRoles.PUBLIC);
};