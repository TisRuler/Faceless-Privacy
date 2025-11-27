type ModalFooterLinkProps = {
  text: string,
  handleLinkClick: () => void;
  isTagUnderACard?: boolean;
};

export const ModalFooterLink: React.FC<ModalFooterLinkProps> = ({ text, handleLinkClick, isTagUnderACard }) => {
  const topMargin = isTagUnderACard ? "-0.5rem" : "0";
  
  return (
    <div
      className={"mb-[-0.4em] flex justify-center"}
      style={{ marginTop: topMargin }}
    >
      <label
        className="btn-sm flex cursor-pointer gap-3 !rounded-xl"
        onClick={handleLinkClick}
      >
        <p className="mt-4 cursor-pointer font-im text-sm text-modal-100">
          {text}
        </p>
      </label>
    </div>
  );
};