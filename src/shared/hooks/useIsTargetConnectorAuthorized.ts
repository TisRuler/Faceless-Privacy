import { useEffect, useState , useMemo} from "react";
import { useConnect } from "wagmi";

export const useIsTargetConnectorAuthorized = (targetConnectorId?: string) => {
  const { connectors } = useConnect();
  
  const targetConnector = useMemo(
    () => connectors.find(c => c.id === targetConnectorId),
    [connectors, targetConnectorId]
  );

  const [isTargetConnectorAuthorised, setIsTargetConnectorAuthorised] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (targetConnector) {
        const authorised = await targetConnector.isAuthorized?.();
        setIsTargetConnectorAuthorised(!!authorised);
      }
    };
    checkAuth();
  }, [targetConnector]);

  return isTargetConnectorAuthorised;
};
