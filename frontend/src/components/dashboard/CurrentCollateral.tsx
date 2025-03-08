import { useUserFinancialData } from "../../hooks/useUserFinancialData";

export const CurrentCollateral = () => {
  const { collateralAmount, loading } = useUserFinancialData();
  return (
    <div className="card bg-gray-800 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-100">
        Current Collateral
      </h2>
      <p className="text-2xl font-bold my-4">
        {loading ? "Loading..." : `$${Number(collateralAmount).toFixed(2)}`}
      </p>
    </div>
  );
};
