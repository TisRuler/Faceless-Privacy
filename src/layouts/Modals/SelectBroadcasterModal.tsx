import { ModalFrame, ModalTitle } from "./shared/components";
import { SelectBroadcasterPanel } from "./shared/panels";
import { closeSelectBroadcasterModal } from "./modalUtils";

export const SelectBroadcasterModal = () => {

  return (
    <ModalFrame onExitClick={closeSelectBroadcasterModal}>

      <ModalTitle title={"Select a Broadcaster"} />
      <SelectBroadcasterPanel />

    </ModalFrame>
  );
};