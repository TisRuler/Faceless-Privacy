import React from "react";
import { ModalFrame, ModalTitle, ModalInfoCard, ModalInfoBox, ModalCentreMessage } from "./shared/components";
import { useErrorStore } from "~~/src/state-managers";
import { closeErrorLogModal} from "./modalUtils";

export const ViewErrorLogModal = () => {
  const errors = useErrorStore((store) => store.errors);

  const noErrors = errors.length === 0;

  return (
    <ModalFrame onExitClick={closeErrorLogModal} isExtraWide={true}>
      <ModalTitle title="Error Log" />             

      <ModalInfoBox>
        Most transaction issues are resolved by switching providers.<br />
        If any problems persist, restart your device or try a different browser.<br />
        For additional support, <a
          href="https://faceless-privacy.gitbook.io/docs/essential-user-guide/help"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline" }}
        >
          click here
        </a>.
      </ModalInfoBox>

      <hr className="border-3 border border-modal-accent-100" />

      { noErrors ? (
        <ModalCentreMessage message="No errors logged"/>
      ) : (
        <>
          <ul className="hide-scrollbar max-h-[23em] overflow-y-scroll rounded-b-md pt-2">
            {errors.map((error: any, index: number) => (
              <li key={index} >
                <ModalInfoCard 
                  expandable={true}
                  title={`${index + 1}. ${error.title}`}
                  body={
                    <>
                      {error.stack && (
                        <pre className="mt-1 whitespace-pre-wrap break-all text-xs">
                          {error.message}
                          {error.stack}
                        </pre>
                      )}
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        </>
      )}

      <hr className="border-3 border border-modal-accent-100" />

    </ModalFrame>
  );
};