import React from "react";
import clsx from "clsx";

interface ToggleAndInputProps {
  defaultOption: string;
  customOption: string;
  customInputField: React.ReactNode;
  hoveringOption: string;
  handleOptionButtonClick: (option: string) => void;
}

export const ToggleAndInput: React.FC<ToggleAndInputProps> = ({
  defaultOption,
  customOption,
  hoveringOption,
  customInputField,
  handleOptionButtonClick,
}) => {

  // Determine button design based on the selected/inactive option
  const getButtonClassName = (option: string) =>
    clsx(
      "rounded-md px-2 py-1 text-modal-base",
      hoveringOption === option
        ? "bg-modal-accent-200 font-im"
        : "font-im"
    );

  return (
    <div className="text-md flex-between flex">
      <div className="mr-2 inline-block whitespace-nowrap rounded-lg border border-modal-accent-100 bg-modal-accent-500 p-[4px] font-im">
        {/* Option buttons */}
        <button
          className={getButtonClassName(defaultOption)}
          onClick={() => handleOptionButtonClick(defaultOption)}
        >
          {defaultOption}
        </button>

        <button
          className={getButtonClassName(customOption)}
          onClick={() => handleOptionButtonClick(customOption)}
        >
          {customOption}
        </button>
      </div>

      {/* Conditional children rendering if inactive option matches */}
      {hoveringOption === customOption && customInputField}
    </div>
  );
};
