import React, { useState } from "react";
import { ModalFrame } from "../shared/components";
import { closeManageProvidersModal } from "../modalUtils";
import { ManageProvidersPanel } from "../shared/panels/";

/*
 * This modal is shown for:
 * - confirming your active networks providers (activating current networks providers)
 * - confirming your upcoming networks providers, then switching the configs to use that network (network switching)
 */
export const ManageProvidersModal = () => {

  const [triggerModalClosure, setTriggerModalClosure] = useState(0); // Used so that ManageProvidersPanel can control clsoing the modal

  return (
    <ModalFrame onExitClick={() => setTriggerModalClosure(triggerModalClosure + 1)}>
      <ManageProvidersPanel 
        closeModal={closeManageProvidersModal}
        modalClosureListener={triggerModalClosure} 
        isPanelAlone={true}
      />
    </ModalFrame>
  );
};