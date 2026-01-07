import { useState } from "react";
import { handleCopyToClipboard } from "../utils/handleCopyToClipboard";
import { ModalInfoCard } from "./ModalInfoCard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface ModalCopyCardProps {
    title?: string;
    textToBeCopied: string
}

// Default visibility is true
export const ModalCopyCard: React.FC<ModalCopyCardProps> = ({ title, textToBeCopied }) => {
    const [linkCopied, setLinkCopied] = useState<boolean>(false);

    const handleCopyClick = () => {
        handleCopyToClipboard(textToBeCopied);
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 2000);
    };
    
    return (
        <ModalInfoCard
            title={title}
            body={textToBeCopied}
            icon={
                linkCopied ? (
                    <CheckCircleIcon
                        className="ml-1 h-6 w-4 cursor-pointer text-xl font-normal"
                        aria-hidden="true"
                        strokeWidth={2}
                    />
                ) : (
                    <DocumentDuplicateIcon
                        className="ml-1 h-6 w-4 cursor-pointer text-xl font-normal"
                        aria-hidden="true"
                        strokeWidth={1.8}
                    />
                )
            }
            onClick={handleCopyClick}
        />
    );
};