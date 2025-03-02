import { useTotalLiquidityUSD } from "../../hooks/useTotalLiquidityUSD";

export const TotalLiquidityUSD = () => {
  const { totalLiquidityUSD, loadingTotalLiquidityUSD } =
    useTotalLiquidityUSD();

  return (
    <div className="card bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        Total Liquidity (USD)
      </h2>

      {loadingTotalLiquidityUSD ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {totalLiquidityUSD.map((token) => (
            <div
              key={token.address}
              className="p-4 rounded-xl shadow-md flex flex-col items-center text-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  {getTokenIcon(token.symbol)} {token.symbol}
                </h3>
              </div>

              <span className="text-md text-gray-300">
                ${Number(token.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getTokenIcon = (symbol: string) => {
  const icons: Record<string, string> = {
    sUSDT: "💵",
    wBTC: "₿",
    wETH: "⚡",
  };
  return icons[symbol] || "🪙";
};
