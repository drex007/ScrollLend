import { Footer } from "../components/Footer";

export const AutomationSettings = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          Automation Settings
        </h1>
        <button className="btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg">
          Connect Wallet
        </button>
      </header>

      {/* Automation Settings */}
      <main className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Configure Automated Actions
        </h2>

        {/* Auto Loan Repayment */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="autoRepayment"
          >
            Enable Auto Loan Repayment
          </label>
          <input
            type="checkbox"
            id="autoRepayment"
            className="toggle toggle-primary"
          />
        </div>

        {/* Collateral Management */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="autoCollateral"
          >
            Enable Automatic Collateral Rebalancing
          </label>
          <input
            type="checkbox"
            id="autoCollateral"
            className="toggle toggle-primary"
          />
        </div>

        {/* Risk Threshold */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="riskThreshold"
          >
            Set Risk Threshold (%)
          </label>
          <input
            type="number"
            id="riskThreshold"
            className="input input-bordered w-full bg-gray-700 text-gray-300"
            placeholder="Enter percentage"
          />
        </div>

        {/* Save Settings */}
        <button className="w-full btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-2 rounded-lg shadow-md">
          Save Settings
        </button>
      </main>
      <Footer />
    </div>
  );
};
