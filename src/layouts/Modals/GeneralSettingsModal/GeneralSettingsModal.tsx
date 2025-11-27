import React, { useState } from "react";
import { ModalFrame } from "../shared/components";
import { ModalHeader } from "./Components/ModalHeader";
import { InitialPanel } from "./Components/InitialPanel";
import { OtherSettingsPanel } from "./Components";
import { closeGeneralSettingsModal } from "../modalUtils";
import { SelectBroadcasterPanel } from "../shared/panels";
import { 
  PrivateModeAmountInputPanel,
  PrivateModeMethodPanel, 
  PrivateModeSettingsPanel, 
  GasPanel 
} from "./Components";

export const GeneralSettingsModal = () => {

  const [isGasPanelDisplayed, setIsGasPanelDisplayed] = useState(false);
  const [isPrivateModeAmountInputPanelDisplayed, setIsPrivateModeAmountInputPanelDisplayed] = useState(false);
  const [isPrivateModeMethodPanelDisplayed, setisPrivateModeMethodPanelDisplayed] = useState(false);
  const [isPrivateModeSettingsPanelDisplayed, setIsPrivateModeSettingsPanelDisplayed] = useState(false);
  const [isOtherPanelDisplayed, setIsOtherPanelDisplayed] = useState(false);
  const [isSelectBroadcasterPanelDisplayed, setIsSelectBroadcasterPanelDisplayed] = useState(false);

  const isInitialPanelActive = !isGasPanelDisplayed && 
    !isOtherPanelDisplayed && 
    !isPrivateModeAmountInputPanelDisplayed && 
    !isPrivateModeMethodPanelDisplayed && 
    !isPrivateModeSettingsPanelDisplayed &&
    !isSelectBroadcasterPanelDisplayed;

  const returnToInitialPanel = () => {
    setIsGasPanelDisplayed(false);
    setIsPrivateModeAmountInputPanelDisplayed(false);
    setisPrivateModeMethodPanelDisplayed(false);
    setIsOtherPanelDisplayed(false);
    setIsSelectBroadcasterPanelDisplayed(false);
    setIsPrivateModeSettingsPanelDisplayed(false);
  };

  const returnToPrivateModeSettingsPanel = () => {
    setIsGasPanelDisplayed(false);
    setIsPrivateModeAmountInputPanelDisplayed(false);
    setisPrivateModeMethodPanelDisplayed(false);
    setIsSelectBroadcasterPanelDisplayed(false);
    setIsPrivateModeSettingsPanelDisplayed(true);
  };

  const returnToOtherPanel = () => {
    setIsGasPanelDisplayed(false);
    setIsPrivateModeAmountInputPanelDisplayed(false);
    setisPrivateModeMethodPanelDisplayed(false);
    setIsOtherPanelDisplayed(true);
    setIsSelectBroadcasterPanelDisplayed(false);
  };
  
  return (
    <>
      <ModalFrame onExitClick={closeGeneralSettingsModal}>

        <ModalHeader
          isInitialPanelActive={isInitialPanelActive}
          isGasPanelDisplayed={isGasPanelDisplayed}
          isPrivateModeAmountInputPanelDisplayed={isPrivateModeAmountInputPanelDisplayed}
          isPrivateModeSettingsPanelDisplayed={isPrivateModeSettingsPanelDisplayed}
          isOtherPanelDisplayed={isOtherPanelDisplayed}
          isPrivateModeMethodPanelDisplayed={isPrivateModeMethodPanelDisplayed}
          isSelectBroadcasterPanelDisplayed={isSelectBroadcasterPanelDisplayed}
          returnToPrivateModeSettingsPanel={returnToPrivateModeSettingsPanel}
          returnToInitialPanel={returnToInitialPanel}
          returnToOtherPanel={returnToOtherPanel}
        />

        {/* Navigation Panels */}
        {isInitialPanelActive && 
          <InitialPanel 
            closeGeneralSettingsModal={closeGeneralSettingsModal}
            setIsPrivateModeSettingsPanelDisplayed={setIsPrivateModeSettingsPanelDisplayed}
            setIsOtherPanelDisplayed={setIsOtherPanelDisplayed}
          />
        }

        {isOtherPanelDisplayed && 
          <OtherSettingsPanel 
            switchToGasSettings={() => {
              setIsOtherPanelDisplayed(false);
              setIsGasPanelDisplayed(true);
            }}
          />
        }

        {isPrivateModeSettingsPanelDisplayed && 
          <PrivateModeSettingsPanel 
            closeThisModal={closeGeneralSettingsModal}
            switchToPrivateModeMethodPanel={() => {
              setIsPrivateModeSettingsPanelDisplayed(false);
              setisPrivateModeMethodPanelDisplayed(true);
            }}
            switchToPrivateModeAmountsPanel={() => {
              setIsPrivateModeSettingsPanelDisplayed(false);
              setIsPrivateModeAmountInputPanelDisplayed(true);
            }}
          />
        }
        
        {/* Sub Panels */}
        {isGasPanelDisplayed && 
          <GasPanel />
        }

        {isPrivateModeAmountInputPanelDisplayed && 
          <PrivateModeAmountInputPanel />
        }

        {isPrivateModeMethodPanelDisplayed && 
          <PrivateModeMethodPanel 
            switchToSelectBroadcaster={() => {
              setisPrivateModeMethodPanelDisplayed(false);
              setIsSelectBroadcasterPanelDisplayed(true);
            }}
          />
        }

        {isSelectBroadcasterPanelDisplayed && 
          <SelectBroadcasterPanel />
        }

      </ModalFrame>
    </>
  );
};

