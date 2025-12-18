import { ModalFrame, ModalTitle, ModalInfoBox } from "./shared/components";
import { closePrivacyPolicyModal } from "./modalUtils";

export const PrivacyPolicyModal = () => {
  return (
    <ModalFrame onExitClick={closePrivacyPolicyModal}>
        <>
            <ModalTitle title={"Faceless Privacy Policy"} />
            <ModalInfoBox>
                1. Faceless (the Dapp) is a privacy-focused application designed to maximize users’ on-chain data protection. 
                The Dapp has no mechanism to collect personal or usage data.
                The Dapp’s developers cannot access or share your data with third parties.
                <br />
                <br />
                2. The Dapp may use local storage, cookies, and ephemeral session references to support the UI/UX.
                No plaintext passwords, signatures, or mnemonics are ever stored, and all sensitive data remains encrypted and accessible only with the user’s password or signature.
                <br />
                <br />
                3. The Dapp initializes with no connections to any RPCs — it is fully up to the users whether they wish to use the defaults or add custom RPCs.
                RPC providers operate independently and are subject to their own privacy policies.
                For network-level privacy, we recommend using a VPN.
                <br />
                <br />
                4. If your device or wallet is compromised, your private data or funds may be at risk; the Dapp itself cannot recover compromised wallets.
            </ModalInfoBox>
        </>
    </ModalFrame>
  )
};