type ModalTitleProps = {
    title: string;
};
    
export const ModalTitle = ({title}: ModalTitleProps) => (
  <>
    <h1 className="font-ib text-xl">{title}</h1>
    <hr className="my-2 mb-4 border border-modal-accent-100" />
  </>
);