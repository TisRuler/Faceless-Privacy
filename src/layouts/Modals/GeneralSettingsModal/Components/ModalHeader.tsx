import React from "react";
import { ModalTitle, ModalTitleWithBackButton } from "../../shared/components";

interface ModalHeaderProps {
  isInitialPanelActive: boolean;
  isGasPanelDisplayed: boolean;
  isPrivateModeAmountInputPanelDisplayed: boolean;
  isOtherPanelDisplayed: boolean;
  isPrivateModeSettingsPanelDisplayed: boolean;
  isPrivateModeMethodPanelDisplayed: boolean;
  isSelectBroadcasterPanelDisplayed: boolean;
  returnToInitialPanel: () => void;
  returnToPrivateModeSettingsPanel: () => void;
  returnToOtherPanel: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  isInitialPanelActive,
  isGasPanelDisplayed,
  isPrivateModeAmountInputPanelDisplayed,
  isPrivateModeSettingsPanelDisplayed,
  isOtherPanelDisplayed,
  isPrivateModeMethodPanelDisplayed,
  isSelectBroadcasterPanelDisplayed,
  returnToInitialPanel,
  returnToPrivateModeSettingsPanel,
  returnToOtherPanel,
}) => {

  const backClickTitles = isOtherPanelDisplayed ? "Other Settings" : 
    isGasPanelDisplayed ? "Gas Settings" : 
      isPrivateModeSettingsPanelDisplayed ? "Private Sending Settings" :
        isPrivateModeAmountInputPanelDisplayed ? "Private Sending Amounts" :
          isPrivateModeMethodPanelDisplayed ? "Private Sending Method" :
            isSelectBroadcasterPanelDisplayed ? "Select a Broadcaster" :
              "General Settings"; // Default

  const isParentPrivateModeSettingsPanel = isPrivateModeMethodPanelDisplayed || isPrivateModeAmountInputPanelDisplayed || isSelectBroadcasterPanelDisplayed;
  const isParentInitalPanel = isPrivateModeSettingsPanelDisplayed || isOtherPanelDisplayed;

  const handleBackClick = () => {
    if (isParentInitalPanel) {
      returnToInitialPanel();
    } else if (isParentPrivateModeSettingsPanel) {
      returnToPrivateModeSettingsPanel();
    } else {
      returnToOtherPanel();
    }
  };
    
  return (
    <>
      {isInitialPanelActive ? (
        <ModalTitle title="General Settings" />
      ) : (
        <ModalTitleWithBackButton 
          title={backClickTitles} 
          onBackClick={handleBackClick}
        />
      )}
    </>
  );
};
