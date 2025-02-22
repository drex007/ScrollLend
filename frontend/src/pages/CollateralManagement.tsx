import { useState } from "react";
import { CollateralCard } from "../components/collateral-management/CollateralCard";
import { CollateralCardSkeleton } from "../components/collateral-management/CollateralCardSkeleton";
import { Footer } from "../components/Footer";
import { useCollateral } from "../hooks/useCollateral";
import { useDepositCollateral } from "../hooks/useDepositCollateral";
import { useWallet } from "../context/WalletConnectProvider";

export const CollateralManagement = () => {
  const { collateral, loading } = useCollateral();
  const { depositCollateral, isDepositing } = useDepositCollateral();
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
              {/* Seleccionar Token */}
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

              {/* Add Collateral */}
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
                    className="btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-4 py-2 rounded-lg shadow-md"
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
          <div className="text-center p-6 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-lg mb-4">🔗 Connect your wallet</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
