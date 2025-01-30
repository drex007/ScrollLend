import { Footer } from "../components/Footer";

export const YieldFarming = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      {/* Yield Farming Overview */}
      <main className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Your Yield Earnings
        </h2>
        <div className="bg-gray-700 p-4 rounded-lg text-gray-300 mb-6">
          <p>
            <strong>Total Yield Earned:</strong> 3.2 ETH
          </p>
          <p>
            <strong>APY:</strong> 12.5%
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          {/* Claim Yield */}
          <button className="flex-1 btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-2 rounded-lg shadow-md">
            Claim Rewards
          </button>

          {/* Reinvest Yield */}
          <button className="flex-1 btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-6 py-2 rounded-lg shadow-md">
            Reinvest Yield
          </button>
        </div>

        {/* Recent Yield Transactions */}
        <h2 className="text-xl font-semibold text-gray-100 mt-8 mb-4">
          Recent Yield Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-700">
                <td className="p-2">01/28/2025</td>
                <td className="p-2">Yield Claimed</td>
                <td className="p-2">+0.5 ETH</td>
                <td className="p-2 text-green-400">Completed</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="p-2">01/27/2025</td>
                <td className="p-2">Yield Reinvested</td>
                <td className="p-2">+1.0 ETH</td>
                <td className="p-2 text-green-400">Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};
