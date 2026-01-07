import { useState } from "react";
import { ModalFrame, ModalTitle, ModalInfoBox, ModalActionButton } from "./shared/components";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { closeGetPaymentLinkModal } from "./modalUtils";
import { masterConfig } from "~~/src/config/masterConfig";
import { ModalCopyCard } from "./shared/components";
import toast from "react-hot-toast";

export const GetPaymentLinkModal = () => {

  const [nickName, setNickName] = useState<string>("");
  const [link, setLink] = useState<string>();

  const isButtonDisabled = nickName?.length < 1;

  const handleLinkGeneration = () => {
    if (isButtonDisabled) {
      return;
    };

    if (nickName.length > 10) {
      toast.error("Nickname Must Be Shorter");
      return;
    };

    const isNicknameValidAlphabet = /^[A-Za-z0-9]+$/.test(nickName);

    if (!isNicknameValidAlphabet) {
      toast.error("Try a Different Nickname");
      return;
    };

    const yourPrivateAddress = usePrivateAddressStore.getState().yourPrivateAddress;
    const baseUrl = masterConfig.baseUrl;

    const link = (`${baseUrl}/wallet/?pay-private-address=${yourPrivateAddress}&nickname=${nickName}`);
    setLink(link);
  };

  return (
    <ModalFrame onExitClick={closeGetPaymentLinkModal} >
      <ModalTitle title="Private Address Payment Link" />

      <ModalInfoBox>
        The nickname you set will be displayed to anyone who opens the link.
      </ModalInfoBox>

      {!link &&
        <input
          type="text"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          className="text-md mb-3 w-full rounded-lg border border-modal-accent-100 bg-modal-accent-500 px-3 py-2 font-im placeholder-modal-200"
          placeholder="Enter your nickname..."
        />
      }

      {link &&
        <ModalCopyCard 
          title="Your Link" 
          textToBeCopied={link}
        />
      }

      {!link &&
        <ModalActionButton
          name="Generate Link"
          isDisabled={isButtonDisabled}
          onClick={handleLinkGeneration}
        />
      }

    </ModalFrame>
  );
};