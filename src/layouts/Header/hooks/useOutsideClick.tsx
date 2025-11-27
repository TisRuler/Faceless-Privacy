import { useEffect, useRef } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) => {
  const callbackRef = useRef(callback); // Store latest callback

  useEffect(() => {
    callbackRef.current = callback; // Update callback on each render
  }, [callback]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        callbackRef.current();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref]);
};
