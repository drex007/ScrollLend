import { useEffect, useState } from "react";
import { useCollateral, CollateralToken } from "./useCollateral";

export const useAvailableCollateral = () => {
  const { collateral, loading } = useCollateral();
  const [availableCollateral, setAvailableCollateral] = useState<
    CollateralToken[]
  >([]);

  useEffect(() => {
    const filteredCollateral = collateral.filter(
      (token) => parseFloat(token.amount) > 1
    );
    setAvailableCollateral(filteredCollateral);
  }, [collateral]);

  return { availableCollateral, loading };
};
