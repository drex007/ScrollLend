import { Footer } from "../components/Footer";
import { UserLiquidity } from "../components/liquidity-pool/UserLiquidity";
import { LiquidityPoolForm } from "../components/liquidity-pool/LiquidityPoolForm";

const TIER_LEVELS = [
  {
    name: "Gold",
    minDeposit: 50000,
    lockPeriod: 30,
    color: "text-yellow-400",
    reward: "⚖️ Balanced rewards",
    icon: "🏆",
  },
  {
    name: "Silver",
    minDeposit: 20000,
    lockPeriod: 20,
    color: "text-gray-400",
    reward: "⚖️ Balanced rewards",
    icon: "🥈",
  },
  {
    name: "Bronze",
    minDeposit: 5000,
    lockPeriod: 10,
    color: "text-orange-400",
    reward: "🎯 Basic rewards",
    icon: "🥉",
  },
];

export const LendingRewards = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-[calc(100vh-96px)] text-gray-200">
      <main className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Lending & Rewards
        </h2>

        {/* User Balance & Tier Info */}
        <UserLiquidity />

        {/* Deposit Form */}
        <LiquidityPoolForm />

        {/* Tier Levels Info */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 text-center">
            Tier Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIER_LEVELS.map((tier) => (
              <div
                key={tier.name}
                className="text-center p-4 bg-gray-900 rounded-lg"
              >
                <span className={`${tier.color} text-3xl`}>{tier.icon}</span>
                <h3 className={`text-lg font-semibold ${tier.color} mt-2`}>
                  {tier.name}
                </h3>
                <ul className="text-sm text-gray-300 text-left mt-2 space-y-2">
                  <li>✨ Minimum deposit: ${tier.minDeposit}</li>
                  <li>⏳ Lock period: {tier.lockPeriod} days</li>
                  <li>{tier.reward}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
