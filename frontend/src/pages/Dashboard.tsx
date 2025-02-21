import { Footer } from "../components/Footer";
import { useHealthFactor } from "../hooks/useHealthFactor";

export const Dashboard = () => {
  const { healthFactor } = useHealthFactor();

  console.log("healthFactor", healthFactor);

  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200 flex-grow">
      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-100">Debt Health</h2>
            <div className="relative w-full bg-gray-700 rounded-full h-4 my-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
            <p className="text-sm">Healthy (80%)</p>
          </div>
          <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-100">
              Borrowed Amount
            </h2>
            <p className="text-2xl font-bold my-4">$12,000</p>
          </div>
          <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-100">
              Current Collateral
            </h2>
            <p className="text-2xl font-bold my-4">$15,000</p>
          </div>
          <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-100">
              Pending Interest
            </h2>
            <p className="text-2xl font-bold my-4">$200</p>
          </div>
        </div>

        {/* Actions */}
        <div className="card bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-col space-y-4">
            <button className="btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white w-full py-2 rounded-lg shadow-md">
              Request Loan
            </button>
            <button className="btn bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white w-full py-2 rounded-lg shadow-md">
              Add Collateral
            </button>
            <button className="btn bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white w-full py-2 rounded-lg shadow-md">
              Withdraw Collateral
            </button>
          </div>
        </div>

        {/* Liquidity Provider Tier Section */}
        <div className="card bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Liquidity Provider Tier
          </h2>
          <p className="text-sm text-gray-300 mb-4">
            Your current tier:{" "}
            <span className="font-bold text-white">Gold</span>
          </p>
          <p className="text-sm text-gray-300 mb-4">
            Locked Liquidity:{" "}
            <span className="font-bold text-white">$50,000</span>
          </p>
          <p className="text-sm text-gray-300 mb-4">
            Time until unlock:{" "}
            <span className="font-bold text-white">30 days</span>
          </p>
          <button className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white w-full py-2 rounded-lg shadow-md">
            Manage Liquidity
          </button>
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
                <td className="px-4 py-2">01/28/2025</td>
                <td className="px-4 py-2">Partial Payment</td>
                <td className="px-4 py-2">+$500 Collateral</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-2">01/27/2025</td>
                <td className="px-4 py-2">Collateral Swap</td>
                <td className="px-4 py-2">+20% Health Ratio</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </div>
  );
};
