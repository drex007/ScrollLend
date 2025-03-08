import { useState } from "react";
import { CollateralToken } from "../../hooks/useCollateral";
import { useWithdrawCollateral } from "../../hooks/useWithdrawCollateral";

interface CollateralCardProps {
  token: CollateralToken;
}

export const CollateralCard = ({ token }: CollateralCardProps) => {
  const [showToast, setShowToast] = useState(false);
  const [showToastError, setShowToastError] = useState(false);
  const [msgError, setMsgError] = useState<string>("");

  const { withdrawCollateral, isWithdrawing } = useWithdrawCollateral(
    () => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setMsgError("");
    },
    (error) => {
      setMsgError(error);
      setShowToastError(true);
      setTimeout(() => setShowToastError(false), 3000);
    }
  );

  return (
    <div className="card w-full bg-gray-800 shadow-xl border border-gray-700 p-4">
      <div className="card-body text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            {getTokenIcon(token.symbol)} {token.symbol}
          </h3>
          <span className="badge badge-secondary">
            {token.amount} {token.symbol}
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          Address: {shortenAddress(token.address)}
        </p>

        {/* Botón de Withdraw */}
        <button
          className="btn bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white w-full py-2 rounded-lg shadow-md mt-4"
          disabled={isWithdrawing}
          onClick={() => withdrawCollateral(token.address)}
        >
          {isWithdrawing ? "Withdrawing..." : "Withdraw"}
        </button>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Withdraw collateral successfully!</span>
          </div>
        </div>
      )}
      {showToastError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>{msgError}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const getTokenIcon = (symbol: string) => {
  switch (symbol) {
    case "sUSDT":
      return "💵";
    case "wBTC":
      return "₿";
    case "wETH":
      return "⚡";
    default:
      return "🪙";
  }
};

const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;
