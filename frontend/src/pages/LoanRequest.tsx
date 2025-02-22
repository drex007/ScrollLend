import { useState } from "react";
import { Footer } from "../components/Footer";
import { useAvailableCollateral } from "../hooks/useAvailableCollateral";
import { useWallet } from "../context/WalletConnectProvider";

export const LoanRequest = () => {
  const { account } = useWallet();
  const { availableCollateral, loading } = useAvailableCollateral();

  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [collateralAmount, setCollateralAmount] = useState<string>("");

  const handleLoanRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken) return;
    console.log("🚀 Requesting loan for:", {
      token: selectedToken,
      loanAmount,
      collateralAmount,
    });
  };

  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      <main className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Loan Request
        </h2>

        {!account ? (
          <div className="text-center p-6 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-lg mb-4">🔗 Connect your wallet</p>
          </div>
        ) : (
          <form onSubmit={handleLoanRequest} className="space-y-6">
            {/* Selección de Token con colateral */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Token
              </label>
              <select
                className="select select-bordered w-full bg-gray-700 text-gray-300"
                value={selectedToken || ""}
                onChange={(e) => setSelectedToken(e.target.value)}
                disabled={loading || availableCollateral.length === 0}
              >
                <option value="" disabled>
                  {loading
                    ? "Loading available collateral..."
                    : availableCollateral.length === 0
                    ? "No collateral available"
                    : "Select a token"}
                </option>
                {availableCollateral.map((token) => (
                  <option key={token.symbol} value={token.address}>
                    {token.symbol} (Available: {token.amount})
                  </option>
                ))}
              </select>
            </div>

            {/* Monto del Préstamo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loan Amount
              </label>
              <input
                type="number"
                className="input input-bordered w-full bg-gray-700 text-gray-300"
                placeholder="Enter amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                disabled={!selectedToken}
              />
            </div>

            {/* Monto del Colateral */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Collateral Amount
              </label>
              <input
                type="number"
                className="input input-bordered w-full bg-gray-700 text-gray-300"
                placeholder="Enter collateral amount"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                disabled={!selectedToken}
              />
            </div>

            {/* Botón de Envío */}
            <div className="text-right">
              <button
                type="submit"
                className="btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-2 rounded-lg shadow-lg"
                disabled={
                  !selectedToken || loanAmount === "" || collateralAmount === ""
                }
              >
                Request Loan
              </button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};
