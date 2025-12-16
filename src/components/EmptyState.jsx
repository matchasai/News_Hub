import { motion } from "framer-motion";
import { AlertCircle, Newspaper, SearchX, WifiOff } from "lucide-react";

const EmptyState = ({ type = "search", message, onRetry }) => {
  const illustrations = {
    search: {
      icon: SearchX,
      title: "No articles found",
      description: message || "Try adjusting your search terms or filters",
      color: "text-blue-500",
    },
    error: {
      icon: AlertCircle,
      title: "Something went wrong",
      description: message || "We couldn't load the articles. Please try again.",
      color: "text-red-500",
    },
    offline: {
      icon: WifiOff,
      title: "No internet connection",
      description: message || "Please check your connection and try again",
      color: "text-orange-500",
    },
    empty: {
      icon: Newspaper,
      title: "No articles available",
      description: message || "Check back later for new content",
      color: "text-gray-500",
    },
  };

  const config = illustrations[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className={`${config.color} mb-6`}
      >
        <Icon size={80} strokeWidth={1.5} />
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {config.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {config.description}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
