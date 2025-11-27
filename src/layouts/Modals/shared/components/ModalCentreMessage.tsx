import React from "react";

interface ModalCentreMessageProps {
  isVisible?: boolean;
  message: string
}

// Default visibility is true
export const ModalCentreMessage: React.FC<ModalCentreMessageProps> = ({ isVisible = true, message }) => {
  if (!isVisible) return null;

  return (
    <div className="text-center font-isb text-lg">
      <p className="mb-10 mt-12">{message}</p>
    </div>
  );
};