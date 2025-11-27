import { ModalBackButton } from "./ModalBackButton";

type ModalTitleWithBackButtonProps = {
    title: string;
    onBackClick: () => void;
};
    
export const ModalTitleWithBackButton = ({title, onBackClick}: ModalTitleWithBackButtonProps) => (
  <>
    <div className="mr-4 flex items-center justify-between">
      <h1 className="font-ib text-xl">{title}</h1>
      <ModalBackButton onClick={onBackClick}/>
    </div>

    <hr className="my-2 mb-4 border border-modal-accent-100" />
  </>
);