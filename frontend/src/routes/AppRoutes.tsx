import { Routes, Route, Navigate } from "react-router-dom";
import { ActivityHistory } from "../pages/ActivityHistory";
import { AutomationSettings } from "../pages/AutomationSettings";
import { CollateralManagement } from "../pages/CollateralManagement";
import { Dashboard } from "../pages/Dashboard";
import { LoanRequest } from "../pages/LoanRequest";
import { LendingRewards } from "../pages/YieldFarming";
import MainLayout from "../pages/MainLayout";
import { DashboardEmpty } from "../pages/DashboardEmpty";
import { LandingPage } from "../pages/LandingPage";
import { useAppKitAccount } from "@reown/appkit/react";

const AppRoutes = () => {
  const { isConnected } = useAppKitAccount();
  return (
    <Routes>
      {/* Landing Page Route (Outside MainLayout) */}
      <Route path="/" element={<LandingPage />} />

      {/* Main App Routes (Nested under `/app/`) */}
      <Route
        path="/app"
        element={isConnected ? <MainLayout /> : <Navigate to="/" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="activity-history" element={<ActivityHistory />} />
        <Route path="automation-settings" element={<AutomationSettings />} />
        <Route
          path="collateral-management"
          element={<CollateralManagement />}
        />
        <Route path="loan-request" element={<LoanRequest />} />
        <Route path="yield-farming" element={<LendingRewards />} />
        <Route path="empty-dashboard" element={<DashboardEmpty />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
