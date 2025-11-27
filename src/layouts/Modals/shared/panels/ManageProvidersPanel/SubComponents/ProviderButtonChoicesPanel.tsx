import { ModalActionButton, ModalCentreMessage } from "../../../components";

interface ProviderButtonChoicesPanelProps {
  handleDefaultChosen: () => void;
  switchToUpdateProviderPanel: () => void;
  isLoading: boolean
}

export const ProviderButtonChoicesPanel: React.FC<ProviderButtonChoicesPanelProps> = ({
  handleDefaultChosen,
  switchToUpdateProviderPanel,
  isLoading,
}) => {

  return (
    <>
      {isLoading ? (
        <ModalCentreMessage message="Updating Providers..."/>
      ) : (
        <>
          <ModalActionButton
            onClick={handleDefaultChosen}
            name="Yes, use default"
          />
          <ModalActionButton
            onClick={switchToUpdateProviderPanel}
            name="No, let me customise"
            isHollowStyle
            className="mt-2"
          />
        </>
      )}
    </> 
  );
};