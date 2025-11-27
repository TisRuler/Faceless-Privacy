import React from "react";

interface WalletCardActionButtonProps {
  text: string;
  isButtonDisabled: boolean;
  handleAction: () => void;
}

export const WalletCardActionButton: React.FC<WalletCardActionButtonProps> = ({
  text,
  isButtonDisabled,
  handleAction,
}) => {
  const centerButtonClass = "mt-6 flex flex-col items-center";
  const buttonTextClass = "font-isb text-base";

  return (
    <div className={centerButtonClass}>
      <button
        onClick={handleAction}
        disabled={isButtonDisabled}
        className="relative mb-2 flex items-center justify-center space-x-3 overflow-hidden rounded-lg border-[0.12em] border-main-base bg-black px-5 py-2 transition duration-500 hover:brightness-150 disabled:cursor-not-allowed sm:border"
        style={{
          // Overflow fix for some browsers like Safari
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "cover",
        }}
      >
        {/* text on top */}
        <span className={`${buttonTextClass} relative z-10`}>{text}</span>

        {/* gradient pinned top-right */}
        <div
          className="pointer-events-none absolute right-0 top-0 z-0 h-16 w-16"
          style={{
            backgroundImage: `radial-gradient(
              ellipse 235% 115% at 0% 60%, 
                #000000 52%, 
                #B8FFAD 60%
            )`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </button>
    </div>
  );
};