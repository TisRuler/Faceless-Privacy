import { useState, useEffect } from "react";
import { useSettingsStore } from "~~/src/state-managers";
import { SettingsPanelMaker } from "../../shared/panels";

export const GasPanel = () => {

  const { 
    setGasChoiceDefault,
    gasChoiceDefault,
    customGweiAmount,
    setCustomGweiAmount
  } = useSettingsStore();

  const [hoveringOption, setHoveringOption] = useState(gasChoiceDefault ? "Default" : "Custom");
  const [gweiAmountUnsubmitted, setGweiAmountUnsubmitted] = useState(customGweiAmount || 0);

  useEffect(() => {
    setHoveringOption(gasChoiceDefault ? "Default" : "Custom");
    setGweiAmountUnsubmitted(customGweiAmount || 0);
  }, [gasChoiceDefault, customGweiAmount]);

  const gasChoiceLabel = gasChoiceDefault ? "Default" : "Custom";

  const handleInitiatorClick = (option: string) => setHoveringOption(option);

  // Simplify selection logic
  const isDefaultSelected =
    (gasChoiceDefault && hoveringOption === "Default") ||
    (!gasChoiceDefault && hoveringOption === "Custom" && gweiAmountUnsubmitted === customGweiAmount);

  const isCustomInputInvalid = gweiAmountUnsubmitted === 0 && hoveringOption === "Custom";

  const buttonText = isCustomInputInvalid
    ? `Use ${hoveringOption}`
    : isDefaultSelected 
      ? "Selected" 
      : `Use ${hoveringOption}`;

  const handleUpdateActiveInitiatorOption = () => {
    if (hoveringOption === "Custom") {
      setGasChoiceDefault(false);
      setCustomGweiAmount(gweiAmountUnsubmitted);
    } else {
      setGasChoiceDefault(true);
    }
  };

  const customGweiInputBox = (
    <input
      onChange={e => {
        const val = e.target.value;
        setGweiAmountUnsubmitted(val === "" ? 0 : Number(val));
      }}
      value={gweiAmountUnsubmitted === 0 ? "" : gweiAmountUnsubmitted}
      type="number"
      className="text-md min-w-0 flex-grow rounded-lg border border-modal-accent-100 bg-modal-accent-500 pl-5 pr-5 font-im placeholder-modal-200 outline-none"
      placeholder="Enter Gwei..."
      min={0}
    />
  );

  const activeOptionToDisplay =
    gasChoiceLabel === "Default" ? "Default (Auto)" : `${customGweiAmount} Gwei (Custom)`;

  return (
    <SettingsPanelMaker
      isOptionSelected={isDefaultSelected}
      hoveringOption={hoveringOption}
      activeOption={activeOptionToDisplay}
      handleUpdateOption={handleUpdateActiveInitiatorOption}
      handleOptionClick={handleInitiatorClick}
      defaultOption={"Default"}
      customOption={"Custom"}
      buttonText={buttonText}
      isCustomInputInvalid={isCustomInputInvalid}
      customInputField={customGweiInputBox}
    />
  );
};
