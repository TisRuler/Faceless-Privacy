// This notice will show if there was an issue fetching token details (issueGettingDetails is true) while no token data is available.

import React from "react";

interface PrivacyCardMessageProps {
  text: string;
}

export const PrivacyCardMessage: React.FC<PrivacyCardMessageProps> = ({ text }) => {
  return (
    <div className='flex items-center justify-center rounded-xl py-[2em]'>
      <p className='mb-2 font-im text-sm text-main-100 sm:text-base'>{text}</p>
    </div>
  );
};
