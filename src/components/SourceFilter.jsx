import { AnimatePresence, motion } from "framer-motion";
import { Building2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

const SourceFilter = ({ articles, onFilterChange, selectedSources }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    // Extract unique sources from articles
    const uniqueSources = [...new Set(
      articles
        .map(article => article.source?.name)
        .filter(Boolean)
    )].sort();
    setSources(uniqueSources);
  }, [articles]);

  const handleSourceToggle = (source) => {
    const updated = selectedSources.includes(source)
      ? selectedSources.filter(s => s !== source)
      : [...selectedSources, source];
    onFilterChange(updated);
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  const handleSelectAll = () => {
    onFilterChange(sources);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 glass border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-xl text-sm font-medium hover:border-primary-500 transition-all"
      >
        <Building2 size={18} className="text-gray-600 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-200">
          Sources {selectedSources.length > 0 && `(${selectedSources.length})`}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 right-0 glass rounded-xl shadow-xl p-4 min-w-[280px] max-h-[400px] overflow-y-auto z-50 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Building2 size={16} />
                  Filter by Source
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleSelectAll}
                  className="flex-1 px-3 py-1.5 text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Clear All
                </button>
              </div>

              {/* Source List */}
              <div className="space-y-1">
                {sources.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No sources available
                  </p>
                ) : (
                  sources.map((source) => (
                    <motion.button
                      key={source}
                      whileHover={{ x: 2 }}
                      onClick={() => handleSourceToggle(source)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                        selectedSources.includes(source)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium truncate">{source}</span>
                      {selectedSources.includes(source) && (
                        <Check size={16} className="ml-2 flex-shrink-0" />
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SourceFilter;
