import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getRecentlyViewed } from "../utils/localStorage";

const RecentlyViewed = () => {
  const [recentArticles, setRecentArticles] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadRecentArticles();
  }, []);

  const loadRecentArticles = () => {
    const recent = getRecentlyViewed();
    setRecentArticles(recent.slice(0, 5));
  };

  if (recentArticles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 bottom-4 z-50"
    >
      {!isExpanded ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(true)}
          className="glass bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-full shadow-lg flex items-center gap-2"
        >
          <Clock size={20} className="text-primary-600" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            Recently Viewed ({recentArticles.length})
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 w-80 max-h-96 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Clock size={20} className="text-primary-600" />
              Recently Viewed
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {recentArticles.map((article, index) => (
              <motion.a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
              >
                <div className="flex gap-3">
                  {article.image && (
                    <img
                      src={article.image}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(article.viewedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecentlyViewed;
