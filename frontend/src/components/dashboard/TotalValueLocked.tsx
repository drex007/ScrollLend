import { useTotalValueLockedUSD } from "../../hooks/useTotalValueLockedUSD";

export const TotalValueLocked = () => {
  const { totalValueLockedUSD, loading } = useTotalValueLockedUSD();

  return (
    <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-100">
        Total Value Locked (TVL)
      </h2>
      <p className="text-2xl font-bold my-4">
        {loading ? "Loading..." : `$${Number(totalValueLockedUSD).toFixed(2)}`}
      </p>
    </div>
  );
};
