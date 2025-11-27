import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="rounded-xl bg-white px-[3em] py-[2em]">
        <ArrowPathIcon className="h-8 w-8 animate-spin" />
      </div>
    </div>
  );
};
