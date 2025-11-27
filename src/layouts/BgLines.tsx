"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUiStore } from "../state-managers";
import { sleep } from "../shared/utils/other/sleep";

export const BgLines = () => {
  const pathname = usePathname();

  const [isCelebrationMode, setIsCelebrationMode] = useState(false);

  const txCelebrationListener = useUiStore((store) => store.txCelebrationListener);

  // Trigger celebration mode
  useEffect(() => {
    if (txCelebrationListener === 0) return;

    const handleCelebration = async () => {
      await sleep(1000);
      setIsCelebrationMode(true);
      await sleep(15000);
      setIsCelebrationMode(false);
    };

    handleCelebration();
  }, [txCelebrationListener]);

  const totalLines = 8;
  const isSubtle = pathname !== "/analytics";
  const animatedSymbolLines = isSubtle
    ? new Set([1, 6])
    : new Set([0, 1, 2, 3, 4, 5, 6, 7]);

  const animationDuration = isCelebrationMode ? 7 : 30;
  const delayBetweenLines = isCelebrationMode ? 3 : 10;

  const symbolColour = isCelebrationMode
    ? "text-background-symbol-100"
    : isSubtle
      ? "text-background-symbol-200"
      : "text-background-symbol-base";

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1]">
      <style>{`
        @keyframes moveSymbol {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh); opacity: 0; }
        }

        .animated-symbol {
          position: absolute;
          left: 0;
          width: 100%;
          text-align: center;
          transform: translateY(100vh);
          padding: 2px 4px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 1.1rem;
          background: black;
          will-change: transform, opacity;
          animation-name: moveSymbol;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }
      `}</style>

      <div className="relative flex h-full w-full justify-between">
        {Array.from({ length: totalLines }).map((_, index) => (
          <div key={index} className="relative flex flex-1 justify-center">
            <div className="relative z-0 h-full w-px bg-background-lines" />
            {animatedSymbolLines.has(index) && (
              <span
                className={`animated-symbol ${symbolColour}`}
                style={{
                  animationDuration: `${animationDuration}s`,
                  animationDelay: `${(delayBetweenLines * index) % animationDuration}s`,
                }}
              >
                ?
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
