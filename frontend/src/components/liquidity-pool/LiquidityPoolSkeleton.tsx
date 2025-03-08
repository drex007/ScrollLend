export const LiquidityPoolSkeleton = () => {
  return (
    <div className="card w-full bg-gray-800 shadow-xl border border-gray-700 animate-pulse">
      <div className="card-body text-white">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-700 rounded"></div>
          <div className="h-4 w-12 bg-gray-700 rounded"></div>
        </div>
        <div className="h-3 w-32 bg-gray-700 rounded mt-2"></div>
      </div>
    </div>
  );
};
