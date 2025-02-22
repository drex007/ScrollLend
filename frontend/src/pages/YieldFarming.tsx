import { useState } from "react";
import { Footer } from "../components/Footer";

const TIER_LEVELS = [
  { name: "Gold", minDeposit: 50000, lockPeriod: 30, color: "text-yellow-400" },
  { name: "Silver", minDeposit: 20000, lockPeriod: 20, color: "text-gray-400" },
  {
    name: "Bronze",
    minDeposit: 5000,
    lockPeriod: 10,
    color: "text-orange-400",
  },
];

export const LendingRewards = () => {
  const [selectedLockPeriod, setSelectedLockPeriod] = useState<number>(30);
  const [depositAmount, setDepositAmount] = useState<string>("");

  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      <main className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Lending & Rewards
        </h2>

        {/* User Balance & Tier Info */}
        <div className="bg-gray-700 p-4 rounded-lg text-gray-300 mb-6">
          <p>
            <strong>Total Liquidity Provided:</strong> 3.2 ETH
          </p>
          <p>
            <strong>Current Tier:</strong>{" "}
            <span className="font-bold text-yellow-400">Gold</span>
          </p>
          <p>
            <strong>APY:</strong> 12.5%
          </p>
        </div>

        {/* Deposit Form */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Provide Liquidity
          </h3>

          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount to Deposit
          </label>
          <input
            type="number"
            className="input input-bordered w-full bg-gray-700 text-gray-300 mb-4"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />

          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lock Period
          </label>
          <select
            className="select select-bordered w-full bg-gray-700 text-gray-300 mb-4"
            value={selectedLockPeriod}
            onChange={(e) => setSelectedLockPeriod(Number(e.target.value))}
          >
            {TIER_LEVELS.map((tier) => (
              <option key={tier.name} value={tier.lockPeriod}>
                {tier.lockPeriod} days
              </option>
            ))}
          </select>

          <button className="btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white w-full py-2 rounded-lg shadow-md">
            Deposit Liquidity
          </button>
        </div>

        {/* Tier Levels Info */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 text-center">
            Tier Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIER_LEVELS.map((tier) => (
              <div
                key={tier.name}
                className="text-center p-4 bg-gray-900 rounded-lg"
              >
                <span className={`${tier.color} text-3xl`}>🏆</span>
                <h3 className={`text-lg font-semibold ${tier.color} mt-2`}>
                  {tier.name}
                </h3>
                <ul className="text-sm text-gray-300 text-left mt-2 space-y-2">
                  <li>✨ Minimum deposit: ${tier.minDeposit}</li>
                  <li>⏳ Lock period: {tier.lockPeriod} days</li>
                  <li>🚀 Higher rewards</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
