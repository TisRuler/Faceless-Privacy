import React from "react";

interface SelectedOptionDisplayProps {
  activeOption: string;
  defaultOption: string;
}

export const SelectedOptionDisplay: React.FC<SelectedOptionDisplayProps> = ({ activeOption, defaultOption }) => {
  return (
    <div className="text-md mb-4 font-im">
      <span>
        Selected:{" "}
        <span className="text-secondary">
          {activeOption === defaultOption ? defaultOption : activeOption}
        </span>
      </span>
    </div>
  );
};
