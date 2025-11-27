import React from "react";
import { useRef, useState, useEffect, ReactNode } from "react";

interface ScaledContainerProps {
  children: ReactNode;
  designWidth?: number; // px value, default = 576px (≈ 36em)
}

export const ScaledContainer: React.FC<ScaledContainerProps> = ({
  children,
  designWidth = 576,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;
      const availableWidth = ref.current.parentElement?.clientWidth || window.innerWidth;
      const newScale = Math.min(1, availableWidth / designWidth);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [designWidth]);

  return (
    <div className="flex w-full justify-center">
      <div
        ref={ref}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: `${designWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};