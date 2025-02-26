import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="card bg-gray-800 shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => navigate("/loan-request")}
          className="btn bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg shadow-md"
        >
          Request Loan
        </button>
        <button
          onClick={() => navigate("/collateral-management")}
          className="btn bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-lg shadow-md"
        >
          Add Collateral
        </button>
        <button
          onClick={() => navigate("/collateral-management")}
          className="btn bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg shadow-md"
        >
          Withdraw Collateral
        </button>
      </div>
    </div>
  );
};
