import { useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  const titles: Record<string, string> = {
    "/": "DefilGuard Dashboard",
    "/activity-history": "Activity History",
    "/automation-settings": "Automation Settings",
    "/collateral-management": "Collateral Management",
    "/loan-request": "Loan Request",
    "/yield-farming": "Yield Farming",
    "/empty-dashboard": "DefilGuard Dashboard",
  };
  const pageTitle = titles[location.pathname] || "DefilGuard Dashboard";
  return (
    <div className="h-24 p-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          {pageTitle}
        </h1>
        <button className="btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg">
          Connect Wallet
        </button>
      </header>
    </div>
  );
};
