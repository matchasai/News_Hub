import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Filter, X } from "lucide-react";
import { useState } from "react";

const DateRangeFilter = ({ onFilterChange, currentFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const presets = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Custom Range", value: "custom" },
  ];

  const handlePresetClick = (value) => {
    if (value === "custom") {
      return;
    }
    onFilterChange({ type: value });
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    if (customRange.start && customRange.end) {
      onFilterChange({ 
        type: 'custom', 
        start: customRange.start, 
        end: customRange.end 
      });
      setIsOpen(false);
    }
  };

  const getFilterLabel = () => {
    if (currentFilter.type === 'custom') {
      return `${new Date(currentFilter.start).toLocaleDateString()} - ${new Date(currentFilter.end).toLocaleDateString()}`;
    }
    return presets.find(p => p.value === currentFilter.type)?.label || "All Time";
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 glass border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-xl text-sm font-medium hover:border-primary-500 transition-all"
      >
        <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-200">{getFilterLabel()}</span>
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
              className="absolute top-full mt-2 right-0 glass rounded-xl shadow-xl p-4 min-w-[280px] z-50 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Filter size={16} />
                  Date Range
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Preset Options */}
              <div className="space-y-1 mb-4">
                {presets.slice(0, 4).map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      currentFilter.type === preset.value
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Range */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Custom Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    id="custom-range-start"
                    name="custom-range-start"
                    value={customRange.start}
                    onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    max={customRange.end || new Date().toISOString().split('T')[0]}
                  />
                  <input
                    type="date"
                    id="custom-range-end"
                    name="custom-range-end"
                    value={customRange.end}
                    onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    min={customRange.start}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <button
                    onClick={handleCustomApply}
                    disabled={!customRange.start || !customRange.end}
                    className="w-full px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
                  >
                    Apply Custom Range
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangeFilter;
