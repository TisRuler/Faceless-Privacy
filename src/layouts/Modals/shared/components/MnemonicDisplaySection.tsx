import React, { useState } from "react";
import { ModalActionButton } from "./ModalActionButton";
import { handleCopyToClipboard } from "../utils/handleCopyToClipboard";
import { ModalInfoBox } from "./ModalInfoBox";

interface MnemonicDisplaySectionProps {
  mnemonic: string;
  handleDoneClick: () => void;
  isDerivedFromPasswordOrUknown: boolean;
}

export const MnemonicDisplaySection: React.FC<MnemonicDisplaySectionProps> = ({
  mnemonic,
  handleDoneClick,
  isDerivedFromPasswordOrUknown,
}) => {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const seedWords = mnemonic.trim().split(/\s+/);

  const toggleShowSeedPhrase = () => setShowSeedPhrase(!showSeedPhrase);

  return (
    <>
      <ModalInfoBox>
        <p>This is your {isDerivedFromPasswordOrUknown ? "only" : "bonus"} private address recovery method.</p>
        <p>{"Write it down offline, don't lose it."}</p>
      </ModalInfoBox>

      {/* Grid layout: auto-rows, 4 columns always */}
      <div className="mt-2 grid grid-cols-4 gap-4">
        {seedWords.map((word, index) => (
          <div
            key={index}
            onClick={toggleShowSeedPhrase}
            className="cursor-pointer select-none rounded border border-modal-accent-100 bg-modal-accent-500 p-2 text-center font-im placeholder-modal-200"
          >
            {showSeedPhrase ? word : "?"}
          </div>
        ))}
      </div>

      <div className="my-4 flex justify-between font-im text-modal-100">
        <button onClick={toggleShowSeedPhrase}>
          {showSeedPhrase ? "Hide Seed Phrase" : "Show Seed Phrase"}
        </button>

        <button onClick={() => handleCopyToClipboard(mnemonic)}>
          Copy Seed Phrase
        </button>
      </div>

      <ModalActionButton name="Done" onClick={handleDoneClick} />
    </>
  );
};
