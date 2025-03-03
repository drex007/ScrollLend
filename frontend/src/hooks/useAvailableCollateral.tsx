import { useEffect, useState } from "react";
import { useCollateral, CollateralToken } from "./useCollateral";

export const useAvailableCollateral = (refreshKey?: number) => {
  const { collateral, loading } = useCollateral();
  const [availableCollateral, setAvailableCollateral] = useState<
    CollateralToken[]
  >([]);

  useEffect(() => {
    setAvailableCollateral(collateral);
  }, [collateral, refreshKey]);

  return { availableCollateral, loading };
};
