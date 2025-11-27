import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

interface ModalInfoCardProps {
  title?: string;
  body?: string | JSX.Element;
  icon?: React.ReactNode | (() => JSX.Element);
  leftImage?: string;
  onClick?: () => void;
  disabled?: boolean;
  isVisible?: boolean;
  expandable?: boolean;
}

export const ModalInfoCard: React.FC<ModalInfoCardProps> = ({
  title,
  body,
  icon,
  leftImage,
  onClick,
  disabled = false,
  isVisible = true,
  expandable = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!isVisible) return null;

  const handleCardClick = () => {
    if (disabled) return;
    if (expandable) {
      setExpanded((prev) => !prev);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-modal-accent-200 ${
        disabled ? "cursor-default" : "cursor-pointer hover:bg-modal-accent-300"
      } mb-2 whitespace-pre-wrap break-words rounded-md px-3.5 py-3`}
    >
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4 ">
          {leftImage && (
            <div className="rounded-md bg-modal-accent-400">
              <img
                src={leftImage}
                alt="left"
                className="m-3 h-7 w-7 flex-shrink-0" // 20px x 20px
              />
            </div>
          )}
          <p className="mr-2 break-all font-isb">{title}</p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {typeof icon === "function" ? icon() : icon}
          {expandable && (
            <span className="h-4 w-4 text-modal-100">
              {expanded ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </span>
          )}
        </div>
      </div>

      {(expandable ? expanded : true) && body && (
        <span
          className="block max-w-full font-im text-modal-100"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {body}
        </span>
      )}
    </div>
  );
};
