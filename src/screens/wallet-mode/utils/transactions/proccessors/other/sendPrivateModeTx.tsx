import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { ContractTransaction } from "ethers";
import { BroadcasterTransaction } from "@railgun-community/waku-broadcaster-client-web";
import { enforceAccountSwitch, getPublicWalletSigner } from "~~/src/shared/utils/wallet";
import { ConnectorRoles } from "~~/src/state-managers/connectorRolesStore";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";
import { useWalletModeScreenStore } from "~~/src/state-managers";

const setIsNonModalWalletActionRequired = useWalletModeScreenStore.getState().setIsNonModalWalletActionRequired;

export const sendPrivateModeTx = async (
  isUsingSelfSignMethod: boolean,
  transaction: ContractTransaction | BroadcasterTransaction,
): Promise<string> => {
  try {
    if (isUsingSelfSignMethod) {
      setIsNonModalWalletActionRequired(true);

      await enforceAccountSwitch(ConnectorRoles.SELF_SIGNING);
      
      const signer = await getPublicWalletSigner(); // Assumes signer is connected
      const txRequest = (transaction as ContractTransaction); // Already populated transaction
      const txResponse = await signer.sendTransaction(txRequest);
      return txResponse.hash;
    } else {
      const hash = await (transaction as BroadcasterTransaction).send();
      return hash;
    }
  } catch (error) {
    throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.ERROR_WITH_SENDING, error);
  } finally {
    setIsNonModalWalletActionRequired(false);
  }
};
