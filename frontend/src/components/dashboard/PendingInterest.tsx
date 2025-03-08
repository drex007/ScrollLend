import { usePendingInterest } from "../../hooks/usePendingInterest";

export const PendingInterest = () => {
  const { pendingInterest, loadingPendingInterest } = usePendingInterest();

  return (
    <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-100">Pending Interest</h2>

      {loadingPendingInterest ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pendingInterest.map((token) => (
            <div
              key={token.address}
              className="p-4 bg-gray-700 rounded-xl flex flex-col items-center text-white shadow-md"
            >
              <span className="text-lg font-semibold">{token.symbol}</span>
              <span className="text-md text-gray-300">
                {token.amount === "Not Available"
                  ? "No Rewards"
                  : `$${Number(token.amount).toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
