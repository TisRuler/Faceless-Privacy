import { ModalFrame, ModalTitle, ModalInfoBox } from "./shared/components";
import { useModalStore } from "~~/src/state-managers";
import { closeToolTipModal} from "./modalUtils";

// Main
export const TooltipModal = () => {
  const toolTipText = useModalStore((store) => store.toolTipText);

  return (
    <ModalFrame onExitClick={closeToolTipModal} >
      <ModalTitle title={toolTipText!.title} />             

      <ModalInfoBox isStringWithLink={true}>
        {toolTipText!.tip}
      </ModalInfoBox>

    </ModalFrame>
  );
};