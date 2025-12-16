import { motion } from "framer-motion";
import { debounce } from "lodash";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SearchBar = ({ onSearch, initialValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 500),
    []
  );

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch(""); 
  };

  return (
    <motion.form
      onSubmit={(e) => e.preventDefault()}
      className={`flex items-center glass rounded-xl shadow-md p-3 w-full max-w-md transition-all duration-300 ${
        isFocused ? 'ring-2 ring-primary-500 shadow-lg' : ''
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 flex-grow">
        <motion.div
          animate={{ scale: isFocused ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Search size={20} className={`${isFocused ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'} transition-colors`} />
        </motion.div>
        <input
          type="text"
          placeholder="Search news articles..."
          id="news-search"
          name="news-search"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === "Escape" && handleClear()}
          className="bg-transparent outline-none text-gray-800 dark:text-gray-200 flex-grow placeholder-gray-500 dark:placeholder-gray-400 text-sm font-medium"
        />
        {searchTerm && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchBar;
