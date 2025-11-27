import { useEffect, useState } from "react";
import { ModalFrame, ModalTitle } from "./shared/components";
import { ConnectWalletPanel, ConnectPrivateAddressPanel } from "./shared/panels";
import { closePrivateModeConnectionGate } from "./modalUtils";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { 
  useConnectorRolesStore, 
  usePrivateAddressStore,
  ConnectorRoles,
} from "~~/src/state-managers";
import { useAccount } from "wagmi";
import { isRailgunWalletReconnectionTypeSignatureOrUnknown } from "~~/src/shared/utils/wallet";
import { validateRailgunAddress } from "@railgun-community/wallet";
import { useBroadcasterMethodStatus } from "~~/src/shared/hooks/useBroadcasterMethodStatus";
import toast from "react-hot-toast";

export const PrivateModeConnectionGateModal = () => {

  const [isSelfSignerProcessing, setIsSelfSignerProcessing] = useState(false);

  const publicConnectorId = useConnectorRolesStore((store) => store.publicConnectorId);
  const selfSigningConnectorId = useConnectorRolesStore((store) => store.selfSigningConnectorId);
  const yourPrivateAddress = usePrivateAddressStore((store) => store.yourPrivateAddress);

  const { isConnected: isAnyWalletActive } = useAccount();
  const { isUsingSelfSignMethod } = useBroadcasterMethodStatus();

  const isReconnectionTypeSignatureOrUnknown = isRailgunWalletReconnectionTypeSignatureOrUnknown();

  // Routing flags
  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();
  const shouldConnectPrivateAddress = !validateRailgunAddress(yourPrivateAddress);
  const shouldConnectPublic = !publicConnectorId && isReconnectionTypeSignatureOrUnknown && !isAnyWalletActive;
  const shouldConnectSelfSigningConnector = isUsingSelfSignMethod && !selfSigningConnectorId;
  const noConnectionsNeeded = !shouldConnectPrivateAddress && !shouldBootstrapNetworkStack && !shouldConnectSelfSigningConnector;

  const shouldDisplayPublicConnectionPanel = shouldConnectPublic && !shouldConnectPrivateAddress;
  const shouldDisplaySelfSignConnectionPanel = shouldConnectSelfSigningConnector && !shouldDisplayPublicConnectionPanel && !shouldConnectPrivateAddress || isSelfSignerProcessing;

  useEffect(() => {
    if (noConnectionsNeeded) closePrivateModeConnectionGate();
  },[yourPrivateAddress, shouldBootstrapNetworkStack]);

  // Ui
  const title = shouldConnectPrivateAddress ? "Connect Private Address" : shouldDisplayPublicConnectionPanel ? "Connect Private Address Owner" : "Connect Self-Signer";
  
  return <ModalFrame onExitClick={closePrivateModeConnectionGate} shouldHandleProvider={true}>
    <>
      <ModalTitle title={title} />

      {shouldConnectPrivateAddress && 
        <ConnectPrivateAddressPanel
          closeParent={closePrivateModeConnectionGate}
        />
      }

      {shouldDisplayPublicConnectionPanel &&
        <ConnectWalletPanel 
          setRole={ConnectorRoles.PUBLIC} 
          onConnection={() => {
            toast.success("Owner Connected");
            
            if (shouldDisplaySelfSignConnectionPanel) { // Skip persistence if public is the final required connection
              closePrivateModeConnectionGate(); 
            } else {
              undefined;
            }
          }} 
        />
      }

      {shouldDisplaySelfSignConnectionPanel &&
        <ConnectWalletPanel 
          setRole={ConnectorRoles.SELF_SIGNING} 
          onConnection={() => {
            closePrivateModeConnectionGate();
            toast.success("Self-Signer Connected");
          }} 
          isProcessing={(processing) => setIsSelfSignerProcessing(processing)}
        />
      }
    </>
  </ModalFrame>;
};