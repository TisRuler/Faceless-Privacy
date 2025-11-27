import React from "react";
import { CardView } from "~~/src/shared/enums";

interface TabProps {
  walletModeCardView: CardView;
  setWalletModeCardView: (value: CardView) => void;
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  text: string;
  roundedClass: string;  // Class for rounded corners
}

// Component for styling each tab
const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, text, roundedClass }) => (
  <div
    onClick={onClick}
    className={`border-cardBorder cursor-pointer border-[0.12em] border-b-0 py-2 sm:border ${roundedClass}`}
    style={{ flex: 1 }}
  >
    <p
      className={`text-center font-isb text-base ${isActive ? "text-main-base underline" : "ml-3 mr-3 whitespace-nowrap text-main-200 hover:brightness-125 sm:ml-0 sm:mr-0"}`}
    >
      {text}
    </p>
  </div>
);

// Main component
export const WalletModeTabs: React.FC<TabProps> = ({ walletModeCardView, setWalletModeCardView }) => (
  <div className="w-full">
    {/* Public/Private tabs */}
    <div className="flex justify-between">
      <TabButton
        isActive={walletModeCardView === CardView.Public}
        onClick={() => setWalletModeCardView(CardView.Public)}
        text={walletModeCardView === CardView.Public ? "Public" : "Public Address"}
        roundedClass="rounded-tl-xl sm:rounded-tl-2xl"
      />
      <TabButton
        isActive={walletModeCardView === CardView.Private}
        onClick={() => setWalletModeCardView(CardView.Private)}
        text={walletModeCardView === CardView.Private ? "Private" : "Private Address"}
        roundedClass="rounded-tr-2xl"
      />
    </div>
  </div>
);
