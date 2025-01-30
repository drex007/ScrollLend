import { Footer } from "../components/Footer";

export const CollateralManagement = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          Manage Collateral
        </h1>
        <button className="btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg">
          Connect Wallet
        </button>
      </header>

      {/* Collateral Overview */}
      <main className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Collateral Overview
        </h2>
        <div className="bg-gray-700 p-4 rounded-lg text-gray-300">
          <p>
            <strong>Total Collateral:</strong> 5.0 ETH
          </p>
          <p>
            <strong>Collateral Value:</strong> $15,000
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-4">
          {/* Add Collateral */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="addCollateral"
            >
              Add Collateral (ETH)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="addCollateral"
                className="input input-bordered w-full bg-gray-700 text-gray-300"
                placeholder="Enter amount"
              />
              <button className="btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-4 py-2 rounded-lg shadow-md">
                Add
              </button>
            </div>
          </div>

          {/* Withdraw Collateral */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="withdrawCollateral"
            >
              Withdraw Collateral (ETH)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="withdrawCollateral"
                className="input input-bordered w-full bg-gray-700 text-gray-300"
                placeholder="Enter amount"
              />
              <button className="btn bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-4 py-2 rounded-lg shadow-md">
                Withdraw
              </button>
            </div>
          </div>

          {/* Rebalance Collateral */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="rebalanceCollateral"
            >
              Rebalance Collateral
            </label>
            <select
              id="rebalanceCollateral"
              className="select select-bordered w-full bg-gray-700 text-gray-300"
            >
              <option value="stable">Convert to Stablecoin (USDT)</option>
              <option value="btc">Convert to BTC</option>
            </select>
            <button className="mt-4 w-full btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 py-2 rounded-lg shadow-md">
              Rebalance
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
