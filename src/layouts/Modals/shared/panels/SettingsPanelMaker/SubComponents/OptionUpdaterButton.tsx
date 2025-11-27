import React from "react";
import { ModalActionButton } from "../../../components";

interface OptionUpdaterButtonProps {
    isOptionSelected: boolean;
    isCustomInputInvalid: boolean;
    handleUpdateOption: () => void;
    buttonText: string;
}

export const OptionUpdaterButton: React.FC<OptionUpdaterButtonProps> = ({ isOptionSelected, isCustomInputInvalid, handleUpdateOption, buttonText }) => {
  return (
    <ModalActionButton 
      name={buttonText} 
      onClick={handleUpdateOption} 
      className="mt-2"
      isStretchedStyle={true} 
      isDisabled={isOptionSelected || isCustomInputInvalid}
    />
  );
};