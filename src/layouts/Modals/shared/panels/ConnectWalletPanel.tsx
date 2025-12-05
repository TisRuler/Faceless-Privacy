import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useConnect, Connector, useAccount, useSwitchAccount } from "wagmi";
import { supportedWalletsConfig } from "~~/src/config/supportedWalletsConfig";
import { ModalCentreMessage, ModalInfoCard } from "../components";
import { useEnforceConnectorChain } from "~~/src/shared/hooks/useEnforceConnectorChain";
import { useConnectorRolesStore, useSettingsStore } from "~~/src/state-managers";
import { getInstalledWallets } from "../utils/getInstalledWallets";
import { logError } from "~~/src/shared/utils/other/logError";
import { getNotificationFromError } from "~~/src/shared/utils/other/getNotificationFromError";
import type { ConnectorRole } from "~~/src/state-managers";
import toast from "react-hot-toast";

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

  const { switchAccountAsync } = useSwitchAccount();
  const { connectAsync, isPending, connectors } = useConnect();
  const { connector: activeConnector } = useAccount();
  const { assignRoleToConnector } = useConnectorRolesStore();
  
  const [isFunctionProccesing, setIsFunctionProccesing] = useState(false); 
  
  const startActivity = () => {
    setIsFunctionProccesing(true);
    isProcessing?.(true);
  };
  
  const endActivity = () => {
    setIsFunctionProccesing(false);
    isProcessing?.(false);
  };

  const { enforceCorrectChain, isSwitching } = useEnforceConnectorChain({
    activeNetwork,
    onConnection,
  });

  const installedWallets = getInstalledWallets(connectors);

  // Handlers
  const handleClick = async (targetConnector: Connector) => {
    
    //Check if handler is active
    if (activeConnector?.id === targetConnector.id) {
      assignRoleToConnector(targetConnector, setRole);
      enforceCorrectChain();
      return;
    }

    const isConnectedToConnector = await targetConnector.isAuthorized();

    if (isConnectedToConnector) {
      // Wallet authorized but not active → switch
      handleSwitchWallet(targetConnector);
    } else {
      // Wallet not authorized → connect
      handleConnectWallet(targetConnector);
    }

  };

  const handleConnectWallet = async (targetConnector: Connector) => {
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

  const handleSwitchWallet = async (targetConnector: Connector) => {
    startActivity();
    try {
      const { accounts } = await switchAccountAsync({ connector: targetConnector });
      if (accounts?.[0]) {
        assignRoleToConnector(targetConnector, setRole);
        
        await enforceCorrectChain();
      }
    } catch (error) {
      toast.error(getNotificationFromError(error, "Error Switching Address"));
      logError(error);
    } finally {
      endActivity();
    }
  };

  // Ui
  const loading = isPending || isSwitching || isFunctionProccesing;

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
                  onClick={() => handleClick(connector)}
                />
              ))}
            </div>
          ) : (
            <>
              <ModalInfoCard 
                body={"Install a wallet to connect and move funds into a private address, below are some popular options."}
                disabled 
              />
              <hr className="border-t-3 my-3 border border-modal-accent-100" />
              <div className="hide-scrollbar max-h-[15.5em] cursor-pointer overflow-y-scroll rounded-md">
                {supportedWalletsConfig.map((wallet) => (
                  <a 
                    key={wallet.name}
                    href={wallet.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ModalInfoCard title={wallet.name} />
                  </a>
                ))}
              </div>
            </>
          )}
        </>
      )} 
    </>
  );
};