import { useLocation } from "react-router-dom";
import { useWallet } from "../context/WalletConnectProvider";
import { useAppKit } from "@reown/appkit/react";

export const Header = () => {
  const { account } = useWallet();
  const { open } = useAppKit();
  const location = useLocation();
  const titles: Record<string, string> = {
    "/app": "ScrollLend Dashboard",
    "/app/activity-history": "Activity History",
    "/app/automation-settings": "Automation Settings",
    "/app/collateral-management": "Collateral Management",
    "/app/loan-request": "Loan Request",
    "/app/yield-farming": "Yield Farming",
    "/app/empty-dashboard": "ScrollLend Dashboard",
  };
  const pageTitle = titles[location.pathname] || "ScrollLend Dashboard";
  return (
    <div className="h-24 p-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          {pageTitle}
        </h1>
        {account ? (
          <div className="flex items-center gap-4">
            <p className="text-white font-bold">{`${account.substring(
              0,
              6
            )}...${account.substring(account.length - 4)}`}</p>
            <button className="btn bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg shadow-lg">
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => open()}
            className="btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg"
          >
            Connect Wallet
          </button>
        )}
      </header>
    </div>
  );
};
