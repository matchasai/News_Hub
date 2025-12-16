import { AnimatePresence, motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ArticleDetails from "./components/ArticleDetails";
import Navbar from "./components/Navbar";
import NewsBoard from "./components/NewsBoard";
import RecentlyViewed from "./components/RecentlyViewed";
import SavedArticles from "./components/SavedArticles";
import { ThemeContext } from "./components/ThemeProvider";
import { ToastProvider } from "./components/Toast";
import { getBookmarks, getUserPreferences, saveUserPreference } from "./utils/localStorage";

const App = () => {
  const preferences = getUserPreferences();
  const [category, setCategory] = useState(preferences.category || "general");
  const [showSavedArticles, setShowSavedArticles] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    // Update bookmark count
    const updateBookmarkCount = () => {
      setBookmarkCount(getBookmarks().length);
    };
    
    updateBookmarkCount();
    // Update count periodically
    const interval = setInterval(updateBookmarkCount, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveUserPreference('category', category);
  }, [category]);

  return (
    <ToastProvider>
      <div className={`${isDark ? "dark" : ""} min-h-screen transition-colors duration-300`}>
        <Navbar setCategory={setCategory} />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NewsBoard category={category} />
                </motion.div>
              </AnimatePresence>
            } 
          />
          <Route path="/article/:articleId" element={<ArticleDetails />} />
        </Routes>

        {/* Floating Bookmark Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSavedArticles(true)}
          className="fixed left-4 bottom-4 z-50 glass bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg flex items-center gap-2"
          title="View saved articles"
        >
          <Bookmark size={24} className="fill-white" />
          {bookmarkCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {bookmarkCount}
            </span>
          )}
        </motion.button>

        {/* Recently Viewed Widget */}
        <RecentlyViewed />

        {/* Saved Articles Modal */}
        <AnimatePresence>
          {showSavedArticles && (
            <SavedArticles onClose={() => setShowSavedArticles(false)} />
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
};

export default App;
