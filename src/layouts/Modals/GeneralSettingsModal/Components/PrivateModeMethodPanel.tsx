import { useState } from "react";
import { useSettingsStore, useBroadcasterStore } from "~~/src/state-managers";
import { SettingsPanelMaker } from "../../shared/panels";
import { ModalFooterLink } from "../../shared/components";
import { useBroadcasterMethodStatus } from "~~/src/shared/hooks/useBroadcasterMethodStatus";

interface PrivateModeMethodPanelProps {
  switchToSelectBroadcaster: () => void;
}

const setBroadcasterFeeToken = useBroadcasterStore.getState().setBroadcasterFeeToken;
const setSendMethod = useBroadcasterStore.getState().setSendMethod;

export const PrivateModeMethodPanel: React.FC<PrivateModeMethodPanelProps> = ({
  switchToSelectBroadcaster
}) => {

  const activeNetwork = useSettingsStore.getState().activeNetwork;
  const { isUsingSelfSignMethod, isUsingDefaultBroadcasterMethod } = useBroadcasterMethodStatus();

  const [hoveringOption, setHoveringOption] = useState("Broadcaster");

  const activePrivateModeMethod = isUsingSelfSignMethod ? "Self-Sign" : "Broadcaster";
  const isHoveringOptionSelected = hoveringOption === activePrivateModeMethod;

  // Functions
  const handleHoveringOptionUpdate = (option: string) => setHoveringOption(option);

  const handleUpdateActiveInitiatorOption = () => {

    setBroadcasterFeeToken(activeNetwork.privateModeBaseToken);

    if (hoveringOption === "Self-Sign") {
      setSendMethod({method: "SELF_SIGN"});
    } else {
      setSendMethod({ method: "DEFAULT_BROADCASTER"});
    }
  };

  const handlePickABroadcaster = () => {
    switchToSelectBroadcaster();
  };

  // Ui
  const activeOptionToDisplay = isUsingSelfSignMethod 
    ? "Self-Sign" 
    : isUsingDefaultBroadcasterMethod 
      ? "Broadcaster (Default)" 
      : "Broadcaster (Picked by you)";

  const buttonText = isHoveringOptionSelected 
    ? "Selected" 
    : `Use ${hoveringOption}`;

  return (
    <>
      <SettingsPanelMaker
        isOptionSelected={isHoveringOptionSelected}
        hoveringOption={hoveringOption}
        activeOption={activeOptionToDisplay}
        handleUpdateOption={handleUpdateActiveInitiatorOption}
        handleOptionClick={handleHoveringOptionUpdate}
        defaultOption={"Broadcaster"}
        customOption={"Self-Sign"}
        buttonText={buttonText}
        isCustomInputInvalid={false}
      />

      <ModalFooterLink 
        text={"Wanna use a non-default broadcaster?"}
        handleLinkClick={handlePickABroadcaster}
      />
    </>
  );
};