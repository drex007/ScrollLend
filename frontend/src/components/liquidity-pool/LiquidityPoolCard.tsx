import { formatDistanceToNow } from "date-fns";
import { LiquidityPool } from "../../hooks/useLiquidityPool";

interface LiquidityPoolCardProps {
  pool: LiquidityPool;
}

export const LiquidityPoolCard = ({ pool }: LiquidityPoolCardProps) => {
  const timeRemaining = formatDistanceToNow(
    new Date(pool.withdrawalTime * 1000),
    { addSuffix: true }
  );

  return (
    <div className="card w-full bg-gray-800 shadow-xl border border-gray-700">
      <div className="card-body text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{pool.symbol}</h3>
          <span className="badge badge-secondary">
            {pool.amount} {pool.symbol}
          </span>
        </div>
        <p className="text-gray-400 text-sm">Withdrawable {timeRemaining}</p>
      </div>
    </div>
  );
};
