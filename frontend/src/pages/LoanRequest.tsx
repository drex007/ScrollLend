import { Footer } from "../components/Footer";

export const LoanRequest = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      {/* Loan Request Form */}
      <main className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Loan Details
        </h2>
        <form className="space-y-6">
          {/* Asset Selection */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="asset"
            >
              Select Asset
            </label>
            <select
              id="asset"
              className="select select-bordered w-full bg-gray-700 text-gray-300"
            >
              <option value="eth">ETH</option>
              <option value="btc">BTC</option>
            </select>
          </div>

          {/* Loan Amount */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="amount"
            >
              Loan Amount
            </label>
            <input
              type="number"
              id="amount"
              className="input input-bordered w-full bg-gray-700 text-gray-300"
              placeholder="Enter amount"
            />
          </div>

          {/* Collateral */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="collateral"
            >
              Collateral (in ETH)
            </label>
            <input
              type="number"
              id="collateral"
              className="input input-bordered w-full bg-gray-700 text-gray-300"
              placeholder="Enter collateral amount"
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-2 rounded-lg shadow-lg"
            >
              Submit Loan Request
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};
