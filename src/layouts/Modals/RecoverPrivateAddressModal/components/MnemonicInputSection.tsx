import React, { useEffect, useRef, useState } from "react";
import { validateMnemonic } from "bip39";
import { ModalActionButton } from "../../shared/components/ModalActionButton";
import { MnemonicLength } from "../../shared/types";
import { ModalFooterLink } from "../../shared/components";

interface MnemonicInputSectionProps {
  mnemonicLength: MnemonicLength;
  handleDone: (phrase: string[]) => void;
  switchToCreatePanel: () => void;
}

export const MnemonicInputSection: React.FC<MnemonicInputSectionProps> = ({
  mnemonicLength,
  handleDone,
  switchToCreatePanel,
}) => {
  const phraseInputsRef = useRef<string[]>(Array(mnemonicLength).fill(""));
  const [isMnemonicValid, setIsMnemonicValid] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [rerenderTrigger, setRerenderTrigger] = useState(0); // force re-render for UI

  useEffect(() => {
    phraseInputsRef.current = Array(mnemonicLength).fill("");
    setIsMnemonicValid(false);
    setRerenderTrigger((x) => x + 1);
  }, [mnemonicLength]);

  const handleInputChange = (value: string, index: number) => {
    phraseInputsRef.current[index] = value.trim();
    const mnemonic = phraseInputsRef.current.join(" ").trim();
    setIsMnemonicValid(validateMnemonic(mnemonic));
    setRerenderTrigger((x) => x + 1);
  };

  const handleToggleSeedPhrase = () => {
    setShowSeedPhrase((prev) => !prev);
  };

  // Wipes sensitive data right before the component unmounts
  useEffect(() => {
    return () => {
      phraseInputsRef.current.fill("");
    };
  }, []);

  const columns = 4;
  const rows = Math.ceil(mnemonicLength / columns);
  const isAnythingInputted = phraseInputsRef.current.some((input) => input.trim() !== "");

  return (
    <>
      <div className="flex flex-col gap-4">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex w-full justify-between gap-4">
            {Array.from({ length: columns }, (_, colIndex) => {
              const inputIndex = rowIndex * columns + colIndex;
              if (inputIndex >= mnemonicLength) return null;

              return (
                <input
                  key={inputIndex}
                  type={showSeedPhrase ? "text" : "password"}
                  value={phraseInputsRef.current[inputIndex] || ""}
                  autoComplete="off"
                  onChange={(e) => handleInputChange(e.target.value, inputIndex)}
                  className="rounded border border-modal-accent-100 bg-modal-accent-500 p-2 text-center font-im text-sm placeholder-modal-200"
                  placeholder={`Word ${inputIndex + 1}`}
                  style={{ flex: 1, maxWidth: "100px", minWidth: "80px" }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {isAnythingInputted && (
        <button
          onClick={handleToggleSeedPhrase}
          className="mt-2 flex cursor-pointer font-im text-modal-100"
        >
          {showSeedPhrase ? "Hide Seed Phrase" : "Show Seed Phrase"}
        </button>
      )}

      <ModalActionButton
        name="Done"
        onClick={() => {
          handleDone([...phraseInputsRef.current]);
          phraseInputsRef.current.fill(""); // Wipe memory immediately
          setRerenderTrigger((x) => x + 1); // Update UI to clear inputs
        }}
        isStretchedStyle={false}
        className="mt-4"
        isDisabled={!isMnemonicValid}
      />

      {!isAnythingInputted && (
        <ModalFooterLink
          text={"Want a new private address without signing?"}
          handleLinkClick={switchToCreatePanel}
        />
      )}
    </>
  );
};
