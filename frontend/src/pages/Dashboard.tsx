import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useHealthFactor } from "../hooks/useHealthFactor";
import { useUserFinancialData } from "../hooks/useUserFinancialData";
import { useTopLiquidityPool } from "../hooks/useTopLiquidityPool";
import { formatDistanceToNow } from "date-fns";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { healthFactor } = useHealthFactor();
  const { borrowedAmount, collateralAmount, loading } = useUserFinancialData();
  const { topPool, tierData, loadingLiquidityPools } = useTopLiquidityPool();

  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200 flex-grow">
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Debt Health */}
          <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-100">Debt Health</h2>
            {healthFactor ? (
              <>
                <div className="relative w-full bg-gray-700 rounded-full h-4 my-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                    style={{
                      width: `${Math.min(
                        (Number(healthFactor) / 3) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm">
                  Health Factor: {Number(healthFactor).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-gray-400">Loading...</p>
            )}
          </div>

          {/* Borrowed Amount */}
          <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-100">
              Borrowed Amount
            </h2>
            <p className="text-2xl font-bold my-4">
              {loading ? "Loading..." : `$${Number(borrowedAmount).toFixed(2)}`}
            </p>
          </div>

          {/* Current Collateral */}
          <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-100">
              Current Collateral
            </h2>
            <p className="text-2xl font-bold my-4">
              {loading
                ? "Loading..."
                : `$${Number(collateralAmount).toFixed(2)}`}
            </p>
          </div>

          {/* Pending Interest */}
          <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-100">
              Pending Interest
            </h2>
            <p className="text-2xl font-bold my-4">-</p>
            <p className="text-gray-400">(TBD)</p>
          </div>
        </div>

        {/* Quick Actions (sin cambios) */}
        <div className="card bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate("/loan-request")}
              className="btn bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg shadow-md"
            >
              Request Loan
            </button>
            <button
              onClick={() => navigate("/collateral-management")}
              className="btn bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-lg shadow-md"
            >
              Add Collateral
            </button>
            <button
              onClick={() => navigate("/collateral-management")}
              className="btn bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg shadow-md"
            >
              Withdraw Collateral
            </button>
          </div>
        </div>
        {/* Liquidity Provider Tier Section */}
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
                  {formatDistanceToNow(
                    new Date(topPool.withdrawalTime * 1000),
                    { addSuffix: true }
                  )}
                </span>
              </p>
              <button
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white w-full py-2 rounded-lg shadow-md"
                onClick={() => navigate("/yield-farming")}
              >
                Manage Liquidity
              </button>
            </>
          ) : (
            <p className="text-gray-400">No active liquidity pools</p>
          )}
        </div>

        {/* Tier Explanation Card */}
        <div className="card bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-100 mb-4 text-center">
            Tier Levels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <span className="text-yellow-400 text-3xl">🏆</span>
              <h3 className="text-lg font-semibold text-yellow-400 mt-2">
                Gold
              </h3>
              <ul className="text-sm text-gray-300 text-left mt-2 space-y-2">
                <li>✨ Minimum deposit: $50,000</li>
                <li>⏳ Lock period: 30 days</li>
                <li>🚀 Highest rewards</li>
              </ul>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <span className="text-gray-400 text-3xl">🥈</span>
              <h3 className="text-lg font-semibold text-gray-400 mt-2">
                Silver
              </h3>
              <ul className="text-sm text-gray-300 text-left mt-2 space-y-2">
                <li>✨ Minimum deposit: $20,000</li>
                <li>⏳ Lock period: 20 days</li>
                <li>⚖️ Balanced rewards</li>
              </ul>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <span className="text-orange-400 text-3xl">🥉</span>
              <h3 className="text-lg font-semibold text-orange-400 mt-2">
                Bronze
              </h3>
              <ul className="text-sm text-gray-300 text-left mt-2 space-y-2">
                <li>✨ Minimum deposit: $5,000</li>
                <li>⏳ Lock period: 10 days</li>
                <li>🎯 Basic rewards</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Activity Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Recent Activities
        </h2>
        <p className="text-gray-400">(TBD)</p>
        <div className="overflow-x-auto">
          <table className="table w-full text-gray-300">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </div>
  );
};
