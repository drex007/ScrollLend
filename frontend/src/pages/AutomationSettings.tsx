import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { useAutomationSettings } from "../hooks/useAutomationSettings";

export const AutomationSettings = () => {
  const { settings, saveSettings } = useAutomationSettings();
  const [newSettings, setNewSettings] = useState(settings);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setNewSettings(settings);
  }, [settings]);

  const handleChange = (
    field: keyof typeof newSettings,
    value: boolean | number
  ) => {
    setNewSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveSettings(newSettings);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
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
            checked={newSettings.autoRepayment}
            onChange={(e) => handleChange("autoRepayment", e.target.checked)}
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
            checked={newSettings.autoCollateral}
            onChange={(e) => handleChange("autoCollateral", e.target.checked)}
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
            value={newSettings.riskThreshold}
            onChange={(e) =>
              handleChange("riskThreshold", Number(e.target.value))
            }
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Save Settings
        </button>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>✅ Settings saved successfully!</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
