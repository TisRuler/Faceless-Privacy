import React from "react";
import { ModalTitleWithBackButton, ModalTitle } from "../../../components";
import { ChainData } from "~~/src/config/chains/types";

interface ModalHeaderProps {
  isButtonChoicesDisplayed: boolean;
  isProviderSettingsDisplayed: boolean;
  isInputCustomRpcPanelDisplayed: boolean;
  isSwitchingNetwork: boolean;
  switchToUpdateProviderPanel: () => void;
  networkData: ChainData;
  shouldBootstrapNetworkStack: boolean;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  isButtonChoicesDisplayed,
  isProviderSettingsDisplayed,
  isInputCustomRpcPanelDisplayed,
  isSwitchingNetwork,
  switchToUpdateProviderPanel,
  networkData,
  shouldBootstrapNetworkStack
}) => {
  
  return (
    <>
      {isButtonChoicesDisplayed && 
        <ModalTitle title="Use Default Network Settings?" />
      }

      {isProviderSettingsDisplayed && (
        <>
          <div className="flex items-center justify-between">
            <ModalTitle title={shouldBootstrapNetworkStack ? "Confirm Your Provider" : "Select a Provider"} />
          
            {isSwitchingNetwork && (
              <div
                className="mb-2 flex items-center space-x-2 rounded-lg border px-3 py-2 font-im text-sm focus:outline-none"
              >
                <span>{networkData.name}</span>
              </div>
            )}
          </div>
          
          <hr className="my-2 border border-modal-accent-100" />
        </>
      )}

      {isInputCustomRpcPanelDisplayed && 
        <ModalTitleWithBackButton 
          title="Add Custom Provider" 
          onBackClick={switchToUpdateProviderPanel} 
        />
      }
    </>
  );
};
