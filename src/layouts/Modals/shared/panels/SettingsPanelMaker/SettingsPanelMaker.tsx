import React from "react";
import { SelectedOptionDisplay, ToggleAndInput, OptionUpdaterButton } from "./SubComponents";

interface SettingsPanelMakerProps {
  isOptionSelected: boolean;
  hoveringOption: string;
  activeOption: string;
  handleUpdateOption: () => void;
  handleOptionClick: (option: string) => void;
  defaultOption: string;
  customOption: string;
  buttonText: string;
  isCustomInputInvalid: boolean;
  customInputField?: React.ReactNode;
}

export const SettingsPanelMaker: React.FC<SettingsPanelMakerProps> = ({
  isOptionSelected,
  hoveringOption,
  activeOption,
  handleUpdateOption,
  handleOptionClick,
  defaultOption,
  customOption,
  buttonText,
  isCustomInputInvalid,
  customInputField,
}) => {

  // Handle button clicks for the option buttons
  const handleOptionButtonClick = (option: string) => {
    handleOptionClick(option);
  };

  return (
    <>
        
      <SelectedOptionDisplay activeOption={activeOption} defaultOption={defaultOption} />

      {/* Toggle between options and handle custom input */}
      <ToggleAndInput
        defaultOption={defaultOption}
        customOption={customOption} 
        hoveringOption={hoveringOption}
        handleOptionButtonClick={handleOptionButtonClick}
        customInputField={customInputField}
      />

      <OptionUpdaterButton
        isOptionSelected={isOptionSelected}
        isCustomInputInvalid={isCustomInputInvalid}
        handleUpdateOption={handleUpdateOption}
        buttonText={buttonText}
      />

    </>
  );
};
