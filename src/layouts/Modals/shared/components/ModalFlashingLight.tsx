type ModalFlashingLightProps = {
  isActive: boolean;
  lightOffWhenInactive?: boolean;
};

export const ModalFlashingLight: React.FC<ModalFlashingLightProps> = ({ isActive, lightOffWhenInactive = true }) => {
  return (
    <div className="relative flex items-center justify-center" role="status" aria-label={isActive ? "Active" : "Inactive"}>
      {isActive ? (
        <>
          <div className="w-[12px] h-[12px] rounded-full border-2 border-modal-accent-500 bg-green-300" />
          <div className="absolute inset-0 m-auto w-[8px] h-[8px] animate-ping rounded-full bg-green-500" />
        </>
      ) : (
        <div className={`w-[12px] h-[12px] rounded-full border-2 border-modal-accent-500 ${lightOffWhenInactive ? "bg-modal-accent-300" : "bg-error"}`} />
      )}
    </div>
  );
};
