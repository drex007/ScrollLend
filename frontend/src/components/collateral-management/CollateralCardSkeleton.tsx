export const CollateralCardSkeleton = () => {
  return (
    <div className="card w-full bg-gray-800 shadow-xl border border-gray-700 animate-pulse">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-16 bg-gray-700 rounded"></div>
          <div className="skeleton h-6 w-12 bg-gray-700 rounded"></div>
        </div>
        <div className="skeleton h-4 w-3/4 bg-gray-700 rounded mt-2"></div>
      </div>
    </div>
  );
};
