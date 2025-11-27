import { useRef, useCallback, useEffect } from "react";

/**
 * useEphemeralPassword
 * Returns:
 *  - passwordRef: attach this to <input type="password" />
 *  - readPassword: reads and immediately clears the password value
 */
export function useEphemeralPassword() {
  const passwordRef = useRef<HTMLInputElement>(null);

  // Reads password once and wipes it from the input
  const readPassword = useCallback(() => {
    if (!passwordRef.current) return null;
    const password = passwordRef.current.value;
    passwordRef.current.value = ""; // wipe immediately
    return password;
  }, []);

  // Auto-clear on unmount to prevent lingering sensitive data
  useEffect(() => {
    return () => {
      if (passwordRef.current) passwordRef.current.value = "";
    };
  }, []);

  return { passwordRef, readPassword };
}
