export const DropdownItemButton = ({
  name,
  Icon,
  onClick,
  bonusClassName = "",
} : {
  name: string;
  Icon?: React.ElementType;
  onClick: () => void;
  bonusClassName?: string;
}) => {
  
  const baseItemStyle = "px-1 w-full cursor-pointer focus:outline-none";
  const hoverStyle = "hover:bg-main-500 hover:rounded-xl";

  return (
    <button
      onClick={onClick}
      className={`${baseItemStyle} ${hoverStyle} ${bonusClassName}`}
    >
      <div className="btn-sm flex cursor-pointer items-center gap-3 whitespace-nowrap py-3 text-xs sm:text-sm">
        {Icon && <Icon className="h-6 w-4" />}
        <span className="whitespace-nowrap">{name}</span>
      </div>
    </button>
  );
};
