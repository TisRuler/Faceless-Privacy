import React from "react";
import { CardView } from "~~/src/shared/enums";
import cardBackground from "~~/src/assets/images/background/cardBackground.svg";
import toast from "react-hot-toast";

interface ViewingOptionTabProps {
  isLoading: boolean;
  viewOption: CardView;
  setViewOption: React.Dispatch<React.SetStateAction<CardView>>;
}

export const ViewingOptionTab: React.FC<ViewingOptionTabProps> = ({ isLoading, viewOption, setViewOption }) => {
  
  const handleToggleViewClick = () => {
    if (isLoading) {
      toast.error("Wait...");
      return;
    }
    setViewOption(viewOption === CardView.Public ? CardView.Private : CardView.Public);
  };

  return (
    <div className="fixed bottom-0 z-10 cursor-pointer" onClick={handleToggleViewClick}>
      <div
        className="border-cardBorder rounded-t-2xl border-l border-r border-t px-6 py-2 text-center font-isb text-sm text-main-base sm:text-lg"
        style={{
          backgroundImage: `url(${cardBackground.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {viewOption === CardView.Public ? "Want to view funds going out?" : "Want to view funds coming in?"}
      </div>
    </div>
  );
};


