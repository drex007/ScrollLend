import { useEffect, useState } from "react";
import { useCollateral, CollateralToken } from "./useCollateral";

export const useAvailableCollateral = (refreshKey?: number) => {
  const { collateral, loading } = useCollateral();
  const [availableCollateral, setAvailableCollateral] = useState<
    CollateralToken[]
  >([]);

  useEffect(() => {
    const filteredCollateral = collateral.filter(
      (token) => parseFloat(token.amount) > 0
    );
    setAvailableCollateral(filteredCollateral);
  }, [collateral, refreshKey]);

  return { availableCollateral, loading };
};
