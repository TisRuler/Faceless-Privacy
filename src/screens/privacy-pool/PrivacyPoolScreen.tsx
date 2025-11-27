import React, { useState } from "react";
import { ViewingOptionTab, PrivacyPoolCard } from "./components";
import { CardView } from "~~/src/shared/enums";
import { usePrivacyPoolScreenStore } from "~~/src/state-managers/privacyPoolScreenStore";

const PrivacyPoolScreen = () => {

  const [viewOption, setViewOption] = useState<CardView>(CardView.Public);

  const isLoading = usePrivacyPoolScreenStore((store) => store.isLoading);
  const setIsLoading = usePrivacyPoolScreenStore.getState().setIsLoading;

  return (
    <div className="flex h-screen justify-center text-main-base">
      <PrivacyPoolCard 
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        viewOption={viewOption} 
      />
      <ViewingOptionTab 
        isLoading={isLoading}
        viewOption={viewOption} 
        setViewOption={setViewOption} 
      />
    </div>
  );
};

export default PrivacyPoolScreen;