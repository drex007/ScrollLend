import { useLiquidityPool } from "../../hooks/useLiquidityPool";
import { LiquidityPoolCard } from "./LiquidityPoolCard";
import { LiquidityPoolSkeleton } from "./LiquidityPoolSkeleton";

export const UserLiquidity = () => {
  const { liquidityPools, loadingLiquidityPools } = useLiquidityPool();

  return (
    <div className="bg-gray-700 p-4 rounded-lg text-gray-300 mb-6">
      <h3 className="text-lg font-semibold mb-2">Your Liquidity Pools</h3>

      {loadingLiquidityPools ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <LiquidityPoolSkeleton key={index} />
            ))}
        </div>
      ) : liquidityPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liquidityPools.map((pool) => (
            <LiquidityPoolCard key={pool.symbol} pool={pool} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-4">
          You haven't provided liquidity yet.
        </p>
      )}
    </div>
  );
};
