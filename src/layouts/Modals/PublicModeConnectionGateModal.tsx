import { useState, useEffect } from "react";
import { ModalActionButton, ModalFrame, ModalTitle } from "./shared/components";
import { 
  usePrivateAddressStore, 
  useSettingsStore, 
  useWalletModeScreenStore, 
  useConnectorRolesStore, 
  ConnectorRoles 
} from "~~/src/state-managers";
import { ConnectWalletPanel, ConnectPrivateAddressPanel } from "./shared/panels";
import { closePublicModeConnectionGateModal } from "./modalUtils";
import { refreshPublicAddressBalances } from "~~/src/shared/utils/tokens";
import { useAccount } from "wagmi";
import { PublicModeDestination } from "~~/src/shared/enums";
import { useIsTargetConnectorAuthorized } from "~~/src/shared/hooks/useIsTargetConnectorAuthorized";
import { isRailgunWalletReconnectionTypePassword } from "~~/src/shared/utils/wallet/isRailgunWalletReconnectionTypePassword";

type Snapshot = {
  yourPrivateAddress: string | null;
  publicModeDestination: PublicModeDestination;
};

type ConnectionMode = "choose" |
  "onlyPublicConnector" | 
  "privateAddressPriority";

export const PublicModeConnectionGateModal = () => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>("choose");

  const activeNetwork = useSettingsStore((store) => store.activeNetwork);
  const publicConnectorId = useConnectorRolesStore((store) => store.publicConnectorId);
  const { isConnected: isAnyWalletActive } = useAccount();

  const isReconnectionTypePassword = isRailgunWalletReconnectionTypePassword();

  const isPublicConnectorAuthorised = useIsTargetConnectorAuthorized(publicConnectorId);

  useEffect(() => {
    const snap: Snapshot = {
      yourPrivateAddress: usePrivateAddressStore.getState().yourPrivateAddress,
      publicModeDestination: useWalletModeScreenStore.getState().publicModeDestination,
    };

    setSnapshot(snap);

    const isMissingPublicConnector = !publicConnectorId || !isPublicConnectorAuthorised;
    const isToSelf = snap.publicModeDestination === PublicModeDestination.ConnectedPrivateAddress;
    const isYourPrivateAddressNotConnected = !snap.yourPrivateAddress;

    const shouldConnectPrivate =
      isToSelf &&
      isYourPrivateAddressNotConnected;

    const shouldConnectPublic = snap.yourPrivateAddress && isMissingPublicConnector;

    if (shouldConnectPrivate) {
      setConnectionMode("privateAddressPriority"); 
    } else if (shouldConnectPublic) {
      setConnectionMode("onlyPublicConnector");
    }

  }, []); 

  if (!snapshot) return null;

  const connectingWalletAndPrivateAddress = publicConnectorId && isAnyWalletActive ? "Connect Private Address" : "Select a Wallet";

  const renderContent = () => {
    switch (connectionMode) {   
    case "privateAddressPriority": // Handles public connector if needed too
      return (
        <>
          <ModalTitle title={connectingWalletAndPrivateAddress} />
          {isReconnectionTypePassword && !publicConnectorId ? (
            <ConnectWalletPanel 
              setRole={ConnectorRoles.PUBLIC}
              onConnection={() => refreshPublicAddressBalances(activeNetwork)}
            />
          ) : (
            <ConnectPrivateAddressPanel
              onConnection={() => {
                closePublicModeConnectionGateModal();
                refreshPublicAddressBalances(activeNetwork);
              }}
            />
          )}
        </>
      );

    case "onlyPublicConnector":
      return (
        <>
          <ModalTitle title="Select a Wallet" />
          <ConnectWalletPanel
            setRole={ConnectorRoles.PUBLIC}
            onConnection={() => {
              closePublicModeConnectionGateModal();
              refreshPublicAddressBalances(activeNetwork);
            }}
          />
        </>
      );

    case "choose":
    default:
      return (
        <>
          <ModalTitle title="Connect Your Private Address Too?" />
          <ModalActionButton
            onClick={() => setConnectionMode("privateAddressPriority")}
            name="Yes, connect both"
          />
          <ModalActionButton
            onClick={() => setConnectionMode("onlyPublicConnector")}
            name="No, only my public address"
            isHollowStyle
            className="mt-2"
          />
        </>
      );
    }
  };

  return <ModalFrame onExitClick={closePublicModeConnectionGateModal} shouldHandleProvider={true}>{renderContent()}</ModalFrame>;
};