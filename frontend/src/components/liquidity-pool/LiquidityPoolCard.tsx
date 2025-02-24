import { formatDistanceToNow } from "date-fns";
import { LiquidityPool } from "../../hooks/useLiquidityPool";

interface LiquidityPoolCardProps {
  pool: LiquidityPool;
}

const getTier = (amount: number): { name: string; color: string } => {
  if (amount >= 50000) return { name: "Gold", color: "text-yellow-400" };
  if (amount >= 20000) return { name: "Silver", color: "text-gray-400" };
  return { name: "Bronze", color: "text-orange-400" };
};

export const LiquidityPoolCard = ({ pool }: LiquidityPoolCardProps) => {
  const timeRemaining = formatDistanceToNow(
    new Date(pool.withdrawalTime * 1000),
    { addSuffix: true }
  );

  const amountNumber = parseFloat(pool.amount);
  const { name: tierName, color: tierColor } = getTier(amountNumber);

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
        <span className={`text-sm font-bold ${tierColor}`}>
          {tierName} Tier
        </span>
      </div>
    </div>
  );
};
