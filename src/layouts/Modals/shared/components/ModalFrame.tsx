import React, { useState } from "react";
import { ManageProvidersPanel } from "../panels";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { ScaledContainer } from "~~/src/shared/components/ScaledContainer";
import cardBackground from "~~/src/assets/images/background/cardBackground.svg";

interface ModalProps {
  children: React.ReactNode;
  onExitClick: () => void;
  shouldHandleProvider?: boolean;
  isExtraWide?: boolean;
}

/*
 * Modal frame:
 * - Foundation for all modals
 * - Includes close button by default
 * - Applies background dimming by default
 * - Handles positioning by default
 * - Provides built-in provider connection integration (commonly required)
 */
export const ModalFrame: React.FC<ModalProps> = ({ children, onExitClick, shouldHandleProvider, isExtraWide }) => {

  const [triggerModalClosure, setTriggerModalClosure] = useState(0); // Used so that ManageProvidersPanel can control clsoing the modal

  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();

  const displayingConfirmProviderModalPanel = shouldHandleProvider && shouldBootstrapNetworkStack;

  // Main function
  const handleExitClick = () => {

    if (displayingConfirmProviderModalPanel) {
      setTriggerModalClosure(triggerModalClosure + 1);
      return;
    }

    onExitClick();
  };

  // Ui
  const renderModalContent = () => {
    if (displayingConfirmProviderModalPanel) {
      return (
        <ManageProvidersPanel 
          closeModal={onExitClick}
          modalClosureListener={triggerModalClosure}
        />
      );
    }
    return children;
  };

  const containerClasses =
    "cursor-pointer fixed inset-0 flex justify-center items-center z-50 bg-black/90 sm:bg-black/85 transition-all duration-200 ease-out";

  const modalClasses =
    `border-2 border-modal-border relative bg-modal-frame text-modal-base rounded-2xl ${isExtraWide ? "min-w-[520px] " : "min-w-[495px] max-w-[500px] sm:ml-[9px]"} p-6 shadow-lg transition-all duration-500 ease-out transform sm:-translate-y-32 cursor-auto`;

  return (
    <div className={containerClasses} onClick={handleExitClick}>
      <ScaledContainer designWidth={isExtraWide ? 550 : 520}>
        <div
          className={`relative w-[36em] overflow-hidden rounded-2xl drop-shadow-card ${modalClasses}`}
          style={{
            backgroundImage: `url(${cardBackground.src})`,
            backgroundSize: "100% 400%",
            backgroundPosition: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* black overlay */}
          <div className="absolute inset-0 rounded-2xl bg-black/30" />

          {/* modal content above overlay */}
          <div className="relative z-10 px-4 py-1">
            {renderModalContent()}
          </div>

          {/* invisible input */}
          <input className="absolute left-0 top-0 h-0 w-0" />

          {/* close button */}
          <button
            className="text-primary-button-gradient btn btn-circle btn-ghost btn-sm absolute right-3 top-3 z-20"
            onClick={handleExitClick}
          >
          ✕
          </button>
        </div>
      </ScaledContainer>
    </div>
  );
};