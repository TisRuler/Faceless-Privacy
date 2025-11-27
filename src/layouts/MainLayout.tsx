import React from "react";
import { Header } from "./Header/Header";
import { ModalsIndex } from "./Modals/ModalsIndex";
import { Toaster } from "react-hot-toast";
import { BgLines } from "./BgLines";
import { PurpleRadialBackground } from "../assets/images/background/PurpleRadialBackground";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "./MetaHeader";

type Props = {
  children: React.ReactNode
}

export const MainLayout = ({ children }: Props) => {

  return (
    <div className="fixed inset-0 min-h-screen w-full bg-black">
      <PurpleRadialBackground  />
      <BgLines />

      <div className="min-h-screen w-full">
        <MetaHeader />
        <div className="relative z-[100]">
          <Header />
        </div>

        {/* <DevToolPanel/> */}

        <main>{children}</main>
        <div className="relative z-[9999]">
          <ModalsIndex />
        </div>

        <Toaster 
          containerStyle={{ top: "2.5rem" }} 
          toastOptions={{ 
            className:"text-xs sm:text-base font-im flex items-center justify-start min-w-0 [&>div]:whitespace-nowrap",
            style: {
              maxWidth: '60em',
              width: 'auto',
            },
            success: { 
              icon: <div className="flex h-5 w-5 min-w-[1.25rem] flex-shrink-0 items-center justify-center rounded-full bg-black"> 
                <CheckIcon className="h-[0.65em] w-[0.65em] text-green-400" strokeWidth={3.75}/> 
              </div> 
            }, 
            error: { 
              icon: ( 
                <div className="flex h-5 w-5 min-w-[1.25rem] flex-shrink-0 items-center justify-center rounded-full bg-black"> 
                  <XMarkIcon className="h-3 w-3 text-red-500" strokeWidth={3}/> 
                </div> 
              ), 
            }, 
          }} 
        />
      </div>

    </div>
  );
};