import { useState } from "react";
import { TOKENS } from "../../utils/Tokens";
import { useAddLiquidity } from "../../hooks/useAddLiquidity";

const TIER_LEVELS = [
  { lockPeriod: 30, label: "30 days" },
  { lockPeriod: 20, label: "20 days" },
  { lockPeriod: 10, label: "10 days" },
];

interface LiquidityPoolFormProps {
  onSuccess: () => void;
}

export const LiquidityPoolForm = ({ onSuccess }: LiquidityPoolFormProps) => {
  const [selectedLockPeriod, setSelectedLockPeriod] = useState<number>(30);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>(TOKENS[0].address);

  const { addLiquidity, isAddingLiquidity } = useAddLiquidity(onSuccess);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">
        Provide Liquidity
      </h3>

      {/* Select Token */}
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Select Token
      </label>
      <select
        className="select select-bordered w-full bg-gray-700 text-gray-300 mb-4"
        value={selectedToken}
        onChange={(e) => setSelectedToken(e.target.value)}
      >
        {TOKENS.map((token) => (
          <option key={token.symbol} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>

      {/* Amount Input */}
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

      {/* Lock Period */}
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Lock Period
      </label>
      <select
        className="select select-bordered w-full bg-gray-700 text-gray-300 mb-4"
        value={selectedLockPeriod}
        onChange={(e) => setSelectedLockPeriod(Number(e.target.value))}
      >
        {TIER_LEVELS.map((tier) => (
          <option key={tier.lockPeriod} value={tier.lockPeriod}>
            {tier.label}
          </option>
        ))}
      </select>

      {/* Deposit Button */}
      <button
        onClick={() =>
          addLiquidity(selectedToken, depositAmount, selectedLockPeriod)
        }
        className="btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white w-full py-2 rounded-lg shadow-md"
        disabled={isAddingLiquidity}
      >
        {isAddingLiquidity ? "Depositing..." : "Deposit Liquidity"}
      </button>
    </div>
  );
};
