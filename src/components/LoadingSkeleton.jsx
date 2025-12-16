const LoadingSkeleton = () => {
  return (
    <div className="glass rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 overflow-hidden">
        <div className="absolute inset-0 shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-4/5 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-2/3 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-full relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-5/6 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-24 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-20 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-24 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer"></div>
            </div>
            <div className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;