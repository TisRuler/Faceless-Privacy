import { openToolTipModal } from "~~/src/layouts/Modals/modalUtils";

interface TooltipProps {
  title: string;
  tip: string;
  isXl?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ title, tip, isXl = false, className }) => {

    const sizeStyle = `${isXl ? "w-5 h-5 text-sm" : "w-4 h-4 text-[10px]"}`;
    const colourStyle = "sm:border-main-base hover:border-main-100 sm:text-main-base text-main-100";

    return (
        <button 
            onClick={() => openToolTipModal(title, tip)} 
            aria-label={`Tooltip: ${title}`}
            className={`${sizeStyle} ${colourStyle} ${className} border rounded-full flex items-center justify-center font-im cursor-pointer ml-2`}
        >
            ?
        </button>
    );
};