import { formatDistanceToNow } from "date-fns";
import { useTopLiquidityPool } from "../../hooks/useTopLiquidityPool";
import { useNavigate } from "react-router-dom";

export const LiquidityProviderTier = () => {
  const navigate = useNavigate();
  const { topPool, tierData, loadingLiquidityPools } = useTopLiquidityPool();
  return (
    <div className="card bg-gray-800 shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        Liquidity Provider Tier
      </h2>

      {loadingLiquidityPools ? (
        <p className="text-gray-400">Loading...</p>
      ) : topPool ? (
        <>
          <p className="text-sm text-gray-300 mb-4">
            Your current tier:{" "}
            <span className={`font-bold ${tierData?.color}`}>
              {tierData?.name}
            </span>
          </p>
          <p className="text-sm text-gray-300 mb-4">
            Locked Liquidity:{" "}
            <span className="font-bold text-white">
              ${parseFloat(topPool.amount).toLocaleString()}
            </span>
          </p>
          <p className="text-sm text-gray-300 mb-4">
            Time until unlock{" "}
            <span className="font-bold text-white">
              {formatDistanceToNow(new Date(topPool.withdrawalTime * 1000), {
                addSuffix: true,
              })}
            </span>
          </p>
          <button
            className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white w-full py-2 rounded-lg shadow-md"
            onClick={() => navigate("/app/yield-farming")}
          >
            Manage Liquidity
          </button>
        </>
      ) : (
        <p className="text-gray-400">No active liquidity pools</p>
      )}
    </div>
  );
};
