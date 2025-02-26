import { useHealthFactor } from "../../hooks/useHealthFactor";

export const HealthFactor = () => {
  const { healthFactor } = useHealthFactor();
  return (
    <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-100">Debt Health</h2>
      {healthFactor ? (
        <>
          <div className="relative w-full bg-gray-700 rounded-full h-4 my-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
              style={{
                width: `${Math.min((Number(healthFactor) / 3) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-sm">
            Health Factor: {Number(healthFactor).toFixed(2)}
          </p>
        </>
      ) : (
        <p className="text-gray-400">Loading...</p>
      )}
    </div>
  );
};
