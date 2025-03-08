import { useMemo } from "react";
import { useLiquidityPool } from "./useLiquidityPool";

const getTier = (amount: number): { name: string; color: string } => {
  if (amount >= 50000) return { name: "Gold", color: "text-yellow-400" };
  if (amount >= 20000) return { name: "Silver", color: "text-gray-400" };
  return { name: "Bronze", color: "text-orange-400" };
};

export const useTopLiquidityPool = () => {
  const { liquidityPools, loadingLiquidityPools } = useLiquidityPool();

  const topPool = useMemo(() => {
    if (!liquidityPools || liquidityPools.length === 0) return null;

    return liquidityPools.reduce((max, pool) =>
      parseFloat(pool.amount) > parseFloat(max.amount) ? pool : max
    );
  }, [liquidityPools]);

  const tierData = topPool ? getTier(parseFloat(topPool.amount)) : null;

  return { topPool, tierData, loadingLiquidityPools };
};
