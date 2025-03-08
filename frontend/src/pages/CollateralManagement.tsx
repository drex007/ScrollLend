import { useState } from "react";
import { CollateralCard } from "../components/collateral-management/CollateralCard";
import { CollateralCardSkeleton } from "../components/collateral-management/CollateralCardSkeleton";
import { Footer } from "../components/Footer";
import { useCollateral } from "../hooks/useCollateral";
import { useDepositCollateral } from "../hooks/useDepositCollateral";
import { useWallet } from "../context/WalletConnectProvider";

export const CollateralManagement = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [showToast, setShowToast] = useState(false);

  const { collateral, loading, fetchCollateral } = useCollateral(refreshKey);
  const { depositCollateral, isDepositing } = useDepositCollateral(() => {
    setRefreshKey((prev) => prev + 1);
    fetchCollateral();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  });
  const { account } = useWallet();
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      {/* Collateral Overview */}
      <main className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Collateral Overview
        </h2>

        {account ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, index) => <CollateralCardSkeleton key={index} />)
            ) : (
              <div className="space-y-4">
                {collateral.map((token) => (
                  <CollateralCard key={token.symbol} token={token} />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select a token
                </label>
                <select
                  className="select select-bordered w-full bg-gray-700 text-gray-300"
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                >
                  <option value="">Select a token</option>
                  {collateral.map((token) => (
                    <option key={token.symbol} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Add Collateral
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="input input-bordered w-full bg-gray-700 text-gray-300"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button
                    className="btn bg-gradient-to-r from-green-500 to-teal-500 text-white"
                    onClick={() => {
                      const token = collateral.find(
                        (t) => t.address === selectedToken
                      );
                      if (token)
                        depositCollateral(
                          token.address,
                          amount,
                          token.decimals
                        );
                    }}
                  >
                    {isDepositing ? "Loading..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-lg text-center">
            🔗 Connect your wallet
          </p>
        )}
      </main>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Collateral add successfully!</span>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
