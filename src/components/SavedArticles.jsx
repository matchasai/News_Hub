import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Calendar, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookmarks, removeBookmark } from "../utils/localStorage";
import EmptyState from "./EmptyState";
import NewsItem from "./NewsItem";

const SavedArticles = ({ onClose }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = getBookmarks();
    setBookmarks(saved);
  };

  const handleRemoveBookmark = (articleUrl) => {
    removeBookmark(articleUrl);
    loadBookmarks();
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all bookmarks?")) {
      bookmarks.forEach((article) => removeBookmark(article.url));
      loadBookmarks();
    }
  };

  const filteredBookmarks = bookmarks
    .filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return b.bookmarkedAt - a.bookmarkedAt;
      } else if (sortBy === "oldest") {
        return a.bookmarkedAt - b.bookmarkedAt;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center overflow-y-auto pt-20 pb-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl shadow-2xl w-full max-w-6xl mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-500 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Bookmark size={28} className="fill-white" />
              <h2 className="text-3xl font-bold">Saved Articles</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-all"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-white/90">
            {bookmarks.length} {bookmarks.length === 1 ? "article" : "articles"} saved
          </p>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="flex items-center glass rounded-xl px-4 py-3 flex-1 max-w-md">
              <Search size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search saved articles..."
                id="saved-articles-search"
                name="saved-articles-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none flex-1 text-gray-800 dark:text-gray-200"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="ml-2">
                  <X size={16} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* Sort & Actions */}
            <div className="flex gap-3">
              <select
                id="saved-articles-sort"
                name="saved-articles-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
              </select>

              {bookmarks.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="p-6 bg-white/30 dark:bg-gray-900/30 max-h-[calc(100vh-400px)] overflow-y-auto">
          {filteredBookmarks.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredBookmarks.map((article, index) => (
                  <motion.div
                    key={article.url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    <NewsItem
                      title={article.title}
                      description={article.description}
                      src={article.image || article.src}
                      url={article.url}
                      publishedAt={article.publishedAt}
                      isBookmarked={true}
                    />
                    <div className="absolute top-2 left-2 glass bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-2 text-xs font-medium">
                      <Calendar size={12} />
                      <span className="text-gray-700 dark:text-gray-300">
                        Saved {new Date(article.bookmarkedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState
              type={searchTerm ? "search" : "empty"}
              message={
                searchTerm
                  ? "No bookmarks match your search"
                  : "You haven't saved any articles yet"
              }
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SavedArticles;
