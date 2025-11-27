import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface ModalBackButtonProps {
    onClick: () => void;
}

export const ModalBackButton = ({ onClick }: ModalBackButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 rounded-lg border border-modal-accent-100 bg-modal-accent-500 px-3 py-2 font-im text-xs hover:bg-modal-accent-200 focus:outline-none"
  >
    <ArrowLeftIcon className="h-4 w-3" strokeWidth="3" />
    <span>Back</span>
  </button>
);
  