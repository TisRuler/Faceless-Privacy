// Helper
const parseLinks = (text: string): React.ReactNode[] => {
  const parts = text.split(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g);
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      elements.push(parts[i]);
      continue;
    }

    if (i % 3 === 1) {
      const label = parts[i];
      const url = parts[i + 1];

      elements.push(
        <a
          key={`${label}-${i}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-[#B8FFAD] underline"
        >
          {label}
        </a>
      );

      i++; // Skip URL
    }
  }

  return elements;
};

// Main
type ModalInfoBoxProps = {
  children: React.ReactNode;
  isStringWithLink?: boolean;
};

export const ModalInfoBox: React.FC<ModalInfoBoxProps> = ({
  children,
  isStringWithLink = false,
}) => {
  const content =
    isStringWithLink && typeof children === "string"
      ? parseLinks(children)
      : children;

  return (
    <div className="mb-4 hide-scrollbar max-h-[19em] overflow-y-scroll rounded-md border-2 border-modal-accent-100 bg-modal-accent-500 px-4 py-2 text-modal-base whitespace-pre-wrap">
      <p className="font-isb text-sm">{content}</p>
    </div>
  );
};