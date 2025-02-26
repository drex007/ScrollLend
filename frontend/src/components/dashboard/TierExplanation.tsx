export const TierExplanation = () => {
  return (
    <div className="card bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-100 mb-4 text-center">
        Tier Levels
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-gray-900 rounded-lg">
          <span className="text-yellow-400 text-3xl">🏆</span>
          <h3 className="text-lg font-semibold text-yellow-400 mt-2">Gold</h3>
          <ul className="text-sm text-gray-300 text-left mt-2 space-y-2">
            <li>✨ Minimum deposit: $50,000</li>
            <li>⏳ Lock period: 30 days</li>
            <li>🚀 Highest rewards</li>
          </ul>
        </div>
        <div className="text-center p-4 bg-gray-900 rounded-lg">
          <span className="text-gray-400 text-3xl">🥈</span>
          <h3 className="text-lg font-semibold text-gray-400 mt-2">Silver</h3>
          <ul className="text-sm text-gray-300 text-left mt-2 space-y-2">
            <li>✨ Minimum deposit: $20,000</li>
            <li>⏳ Lock period: 20 days</li>
            <li>⚖️ Balanced rewards</li>
          </ul>
        </div>
        <div className="text-center p-4 bg-gray-900 rounded-lg">
          <span className="text-orange-400 text-3xl">🥉</span>
          <h3 className="text-lg font-semibold text-orange-400 mt-2">Bronze</h3>
          <ul className="text-sm text-gray-300 text-left mt-2 space-y-2">
            <li>✨ Minimum deposit: $5,000</li>
            <li>⏳ Lock period: 10 days</li>
            <li>🎯 Basic rewards</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
