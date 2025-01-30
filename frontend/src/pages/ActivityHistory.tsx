import { Footer } from "../components/Footer";

export const ActivityHistory = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      {/* Activity History Table */}
      <main className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Recent Transactions
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
                <td className="p-2">Collateral Added</td>
                <td className="p-2">+2.5 ETH</td>
                <td className="p-2 text-green-400">Completed</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="p-2">01/27/2025</td>
                <td className="p-2">Loan Repaid</td>
                <td className="p-2">-0.8 ETH</td>
                <td className="p-2 text-green-400">Completed</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="p-2">01/26/2025</td>
                <td className="p-2">Rebalanced Collateral</td>
                <td className="p-2">1.0 ETH → USDT</td>
                <td className="p-2 text-yellow-400">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};
