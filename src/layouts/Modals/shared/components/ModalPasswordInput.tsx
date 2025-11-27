type ModalPasswordInputProps = {
  passwordRef: React.RefObject<HTMLInputElement>;
  isForConfirmation?: boolean;
};

export const ModalPasswordInput = ({ passwordRef, isForConfirmation = false }: ModalPasswordInputProps) => (
  <input
    ref={passwordRef}
    type="password"
    className="text-md mb-3 w-full rounded-lg border border-modal-accent-100 bg-modal-accent-500 px-3 py-2 font-im placeholder-modal-200"
    placeholder={isForConfirmation ? "Enter The Same Password..." : "Enter Password..."}
    autoComplete="new-password" // prevents browser autofill
  />
);