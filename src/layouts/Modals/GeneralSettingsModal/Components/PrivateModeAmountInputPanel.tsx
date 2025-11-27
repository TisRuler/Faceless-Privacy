import { useWalletModeScreenStore } from "~~/src/state-managers";
import { useState } from "react";
import { SettingsPanelMaker } from "../../shared/panels";

export const PrivateModeAmountInputPanel = () => {

  const isDisplayingCommonPrivateModeAmounts = useWalletModeScreenStore((store) => store.isDisplayingCommonPrivateModeAmounts);
  const setIsDisplayingCommonPrivateModeAmounts = useWalletModeScreenStore.getState().setIsDisplayingCommonPrivateModeAmounts;
  const setAmount = useWalletModeScreenStore.getState().setAmount;
  
  const [hoveringOption, setHoveringOption] = useState(isDisplayingCommonPrivateModeAmounts ? "Pre-set" : "Default");

  const handleInitiatorClick = (option: string) => setHoveringOption(option);

  const isHoveringOptionSelected =
    (isDisplayingCommonPrivateModeAmounts && hoveringOption === "Pre-set") || 
      !isDisplayingCommonPrivateModeAmounts && hoveringOption === "Default";

  const handleUpdateActiveInitiatorOption = () => {
    if (hoveringOption === "Default") {
      setIsDisplayingCommonPrivateModeAmounts(false);
      setAmount("0");
    } else {
      setIsDisplayingCommonPrivateModeAmounts(true);
      setAmount("0");
    }
  };

  const activeOptionToDisplay = isDisplayingCommonPrivateModeAmounts === true ? "Pre-Set Amounts" : "Default (Custom Amounts)";

  const buttonText = isHoveringOptionSelected 
    ? "Selected" 
    : `Use ${hoveringOption}`;

  return (
    <SettingsPanelMaker
      isOptionSelected={isHoveringOptionSelected}
      hoveringOption={hoveringOption}
      activeOption={activeOptionToDisplay}
      handleUpdateOption={handleUpdateActiveInitiatorOption}
      handleOptionClick={handleInitiatorClick}
      defaultOption={"Default"}
      customOption={"Pre-set"}
      buttonText={buttonText}
      isCustomInputInvalid={false}
    />
  );
};



