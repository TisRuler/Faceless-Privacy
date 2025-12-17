import { ModalFrame, ModalTitle, ModalInfoBox } from "./shared/components";
import { useModalStore } from "~~/src/state-managers";
import { closeToolTipModal} from "./modalUtils";

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
export const TooltipModal = () => {
  const toolTipText = useModalStore((store) => store.toolTipText);

  return (
    <ModalFrame onExitClick={closeToolTipModal} >
      <ModalTitle title={toolTipText!.title} />             

      <ModalInfoBox>
        {parseLinks(toolTipText!.tip)}
      </ModalInfoBox>

    </ModalFrame>
  );
};