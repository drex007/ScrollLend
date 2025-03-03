import { Footer } from "../components/Footer";
import { Activity } from "../components/dashboard/Activity";
import { CurrentCollateral } from "../components/dashboard/CurrentCollateral";
import { BorrowedAmount } from "../components/dashboard/BorredAmount";
import { HealthFactor } from "../components/dashboard/HealthFactor";
import { LiquidityProviderTier } from "../components/dashboard/LiquidityProviderTier";
import { QuickActions } from "../components/dashboard/QuickActions";
import { TierExplanation } from "../components/dashboard/TierExplanation";
import { TotalValueLocked } from "../components/dashboard/TotalValueLocked";
import { TotalLiquidityUSD } from "../components/dashboard/TotalLiquidityUSD";
import { PendingInterest } from "../components/dashboard/PendingInterest";

export const Dashboard = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200 flex-grow">
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Debt Health */}
          <HealthFactor />

          {/* Borrowed Amount */}
          <BorrowedAmount />

          {/* Current Collateral */}
          <CurrentCollateral />

          {/* Pending Interest */}
          <PendingInterest />
        </div>

        {/* Quick Actions (sin cambios) */}
        <QuickActions />

        {/* TVL */}
        <TotalValueLocked />

        {/* Total liquidity */}
        <TotalLiquidityUSD />

        {/* Liquidity Provider Tier Section */}
        <LiquidityProviderTier />

        {/* Tier Explanation Card */}
        <TierExplanation />
      </main>

      {/* Activity Section */}
      <Activity />

      <Footer />
    </div>
  );
};
