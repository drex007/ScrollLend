import { Routes, Route } from "react-router-dom";
import { ActivityHistory } from "../pages/ActivityHistory";
import { AutomationSettings } from "../pages/AutomationSettings";
import { CollateralManagement } from "../pages/CollateralManagement";
import { Dashboard } from "../pages/Dashboard";
import { LoanRequest } from "../pages/LoanRequest";
import { YieldFarming } from "../pages/YieldFarming";
import MainLayout from "../pages/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/activity-history" element={<ActivityHistory />} />
        <Route path="/automation-settings" element={<AutomationSettings />} />
        <Route
          path="/collateral-management"
          element={<CollateralManagement />}
        />
        <Route path="/loan-request" element={<LoanRequest />} />
        <Route path="/yield-farming" element={<YieldFarming />} />
        <Route path="/empty-dashboard" element={<YieldFarming />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
