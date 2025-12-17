import { openToolTipModal } from "~~/src/layouts/Modals/modalUtils";

interface TooltipProps {
  title: string;
  tip: string;
  isXl?: boolean;
  isSolidColour?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ title, tip, isXl = false, isSolidColour = true }) => {

    const sizeStyle = `${isXl ? "w-5 h-5 text-sm" : "w-4 h-4 text-[10px]"}`;
    const colourStyle = `${isSolidColour ? "border-white text-white" : "text-main-100 hover:text-main-base border-main-100 hover:border-main-base"}`;

    return (
        <button 
            onClick={() => openToolTipModal(title, tip)} 
            aria-label={`Tooltip: ${title}`}
            className={`${sizeStyle} ${colourStyle} border rounded-full flex items-center justify-center font-im cursor-pointer ml-2`}
        >
            ?
        </button>
    );
};