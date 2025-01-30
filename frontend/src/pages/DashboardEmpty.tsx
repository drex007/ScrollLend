import { Footer } from "../components/Footer";

export const DashboardEmpty = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          Welcome to DefilGuard!
        </h2>
        <p className="text-gray-300 mb-6">
          Start by requesting your first loan or adding collateral.
        </p>
        <div className="flex space-x-4 justify-center">
          <button className="btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-2 rounded-lg shadow-md">
            Request Loan
          </button>
          <button className="btn bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white px-6 py-2 rounded-lg shadow-md">
            Add Collateral
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
