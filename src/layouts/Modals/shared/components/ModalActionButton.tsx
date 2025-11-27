type ModalActionButtonProps = {
  name: string;
  onClick: () => void;
  className?: string;
  isHollowStyle?: boolean;
  isStretchedStyle?: boolean;
  isDisabled?: boolean;
};
  
export const ModalActionButton = ({
  name,
  onClick,
  className,
  isHollowStyle = false,
  isStretchedStyle = true,
  isDisabled = false,
}: ModalActionButtonProps) => {

  const textColour = isHollowStyle ? "text-modal-base" : "text-modal-accent-300";
  const bgClass = isHollowStyle ? "bg-modal-accent-500 border-modal-accent-200 border-2" : "bg-modal-action-button";
  const widthClass = isStretchedStyle ? "w-full" : "px-6 mx-auto";
  const disabledClass = isDisabled ? "opacity-90 cursor-auto cursor-default" : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center space-x-3 rounded-md py-2 
        ${bgClass} ${disabledClass} ${widthClass} ${className}
      `}
      disabled={isDisabled}
    >
      <p className={`text-md font-im ${textColour}`}>{name}</p>
    </button>
  );
};