import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useConnect, Connector, useAccount } from "wagmi";
import { SupportedWallet, supportedWalletsConfig } from "~~/src/config/supportedWalletsConfig";
import { ModalCentreMessage, ModalInfoCard } from "../components";
import { useEnforceConnectorChain } from "~~/src/shared/hooks/useEnforceConnectorChain";
import { useConnectorRolesStore, useSettingsStore } from "~~/src/state-managers";
import { getInstalledWallets } from "../utils/getInstalledWallets";
import { logError } from "~~/src/shared/utils/other/logError";
import { getNotificationFromError } from "~~/src/shared/utils/other/getNotificationFromError";
import type { ConnectorRole } from "~~/src/state-managers";
import toast from "react-hot-toast";

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ConnectWalletPanelProps {
  setRole: ConnectorRole;
  onConnection?: () => void;
  isProcessing?: (active: boolean) => void;
}

export const ConnectWalletPanel: React.FC<ConnectWalletPanelProps> = ({
  setRole,
  onConnection,
  isProcessing,
}) => {

  const activeNetwork = useSettingsStore.getState().activeNetwork;

  // Hooks
  const { connectAsync, isPending, connectors } = useConnect();
  const { connector: activeConnector } = useAccount();
  const { assignRoleToConnector } = useConnectorRolesStore();

  const [isFunctionProcessing, setIsFunctionProcessing] = useState(false); 

  // Other
  const isUsingMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const startActivity = () => {
    setIsFunctionProcessing(true);
    isProcessing?.(true);
  };
  
  const endActivity = () => {
    setIsFunctionProcessing(false);
    isProcessing?.(false);
  };

  const { enforceCorrectChain, isSwitching } = useEnforceConnectorChain({
    activeNetwork,
    onConnection,
  });

  // Wallet lists
  const installedWallets = getInstalledWallets(connectors);

  const mobileSupportedWallets = supportedWalletsConfig
  .filter(wallet => wallet.scheme)
  .map(wallet => ({
    ids: wallet.ids,
    name: wallet.name,
    website: wallet.website,
    scheme: wallet.scheme,
  }));

  const walletsToDisplayIfNoneAreInstalled = isUsingMobile ? mobileSupportedWallets : supportedWalletsConfig;

  // Handlers
  const handleNoInstalledWalletsClick = async (wallet: SupportedWallet) => {
    const websiteUrl = wallet.website;
    const schemeUrl = wallet.scheme;
  
    if (!isUsingMobile || !schemeUrl) {
      window.open(websiteUrl, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = schemeUrl!; // Try opening the wallet app
  
    await pause(1250);
    toast.success("Ensure The Wallet's App Is Downloaded", {duration: 12000});
  }

  const handleInstalledWalletClick = async (targetConnector: Connector) => {
    if (activeConnector?.id === targetConnector.id) { // Already active? Just assign role and enforce chain
      assignRoleToConnector(targetConnector, setRole);
      enforceCorrectChain();
      return;
    }
  
    handleConnectInstalledWallet(targetConnector);
  };

  const handleConnectInstalledWallet = async (targetConnector: Connector) => {
    startActivity();

    try {
      const { accounts } = await connectAsync({ connector: targetConnector });
      if (accounts?.[0]) {
        assignRoleToConnector(targetConnector, setRole);
        
        await enforceCorrectChain();
      }
    } catch (error) {
      toast.error(getNotificationFromError(error, "Error Connecting, Check Wallet"));
      logError(error);
    } finally {
      endActivity();
    }
  };

  // Ui
  const noInstalledWalletsFoundText = isUsingMobile ? 
    "You'll be redirected to your selected wallet's app. You’ll need to use Faceless in its built-in browser." : 
    "Install a wallet. Below are some supported options.";

  const loading = isPending || isSwitching || isFunctionProcessing;

  return (
    <>
      {loading ? (
        <ModalCentreMessage message="Connecting..."/>
      ) : (
        <>
          {installedWallets.length > 0 ? (
            <div className="hide-scrollbar max-h-[18em] cursor-pointer overflow-y-scroll rounded-md">
              {installedWallets.map((connector) => (
                <ModalInfoCard
                  key={connector.id}
                  leftImage={connector.icon}
                  title={connector.name}
                  icon={<ChevronRightIcon className="h-4 w-4 text-xl font-normal" strokeWidth={2.4} />}
                  onClick={() => handleInstalledWalletClick(connector)}
                />
              ))}
            </div>
          ) : (
            <>
              <ModalInfoCard 
                body={noInstalledWalletsFoundText}
                disabled
              />

              <hr className="border-t-3 my-3 border border-modal-accent-100" />

              <div className="hide-scrollbar max-h-[15.5em] cursor-pointer overflow-y-scroll rounded-md">
                  {walletsToDisplayIfNoneAreInstalled.map(wallet => (
                    <ModalInfoCard 
                      key={wallet.name}
                      title={wallet.name} 
                      onClick={() => handleNoInstalledWalletsClick(wallet)}
                    />
                  ))
                }
              </div>
            </>
          )}
        </>
      )} 
    </>
  );
};