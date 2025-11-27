import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Helper
interface ModalBackButtonProps {
    toggleTitle?: string;
    onClick: () => void;
}

const Toggle = ({ toggleTitle, onClick }: ModalBackButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 rounded-lg border border-modal-accent-100 px-3 py-2 font-im text-xs hover:bg-modal-accent-500 focus:outline-none"
  >
    <ChevronDownIcon className="h-4 w-3" strokeWidth="3" />
    <span>{toggleTitle}</span>
  </button>
);
  
// Main
type ModalTitleWithToggleProps = {
    title: string;
    toggleTitle?: string;
    onClick: () => void;
    isDisplayingToggle: boolean;
};
    
export const ModalTitleWithToggle = ({title, toggleTitle, onClick, isDisplayingToggle}: ModalTitleWithToggleProps) => (
  <>
    <div className="mr-4 flex items-center justify-between">
      <h1 className="font-ib text-xl">{title}</h1>
      {isDisplayingToggle && <Toggle toggleTitle={toggleTitle} onClick={onClick}/>}
    </div>

    <hr className="my-2 mb-4 border border-modal-accent-100" />
  </>
);