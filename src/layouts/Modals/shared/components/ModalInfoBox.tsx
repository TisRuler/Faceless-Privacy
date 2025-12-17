export const ModalInfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 hide-scrollbar max-h-[19em] overflow-y-scroll rounded-md border-2 border-modal-accent-100 bg-modal-accent-500 px-4 py-2 text-modal-base whitespace-pre-wrap">
    <p className="font-isb text-sm">{children}</p>
  </div>
);