import { motion } from "framer-motion";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { getUserPreferences, saveUserPreference } from "../utils/localStorage";
import DateRangeFilter from "./DateRangeFilter";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";
import NewsItem from "./NewsItem";
import SearchBar from "./SearchBar";
import SourceFilter from "./SourceFilter";

const NewsBoard = ({ category }) => {
  const preferences = getUserPreferences();
  const [articles, setArticles] = useState([]);
    const [allArticles, setAllArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState(preferences.searchTerm || "");
  const [sortBy, setSortBy] = useState(preferences.sortOrder || "publishedAt");
  const [dateFilter, setDateFilter] = useState({ type: 'all' });
  const [selectedSources, setSelectedSources] = useState([]);

  // Get backend API URL from environment or use relative path
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api';

  const fetchNews = async (pageNum, search) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        category,
        lang: 'en',
        country: 'in',
        max: '6',
        page: pageNum
      });

      if (search) params.append('q', search);
      if (sortBy === "relevancy") params.append('sortBy', 'relevancy');

      // Call backend proxy instead of gnews directly
      const response = await fetch(`${backendUrl}/news/top-headlines?${params}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.status === 426) {
        setError("⚠️ API Plan Limit Reached: Upgrade Required");
        return { articles: [] };
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("News fetch failed", err);
      setError(`⚠️ Error fetching news: ${err.message}`);
      return { articles: [] };
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchNews(page, searchTerm);

        setArticles((prevArticles) => {
          const newArticles = page === 1 ? data.articles || [] : [...prevArticles, ...(data.articles || [])];
          setAllArticles(newArticles);
          // Save articles for routing
          localStorage.setItem('current-articles', JSON.stringify(newArticles));
          return newArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        });

        setHasMore((data.articles || []).length > 0);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [category, page, searchTerm, sortBy]);

  // Apply filters once articles or filters change
  useEffect(() => {
    let filtered = [...articles];

    // Date filter
    if (dateFilter.type !== 'all') {
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter(article => {
        const articleDate = new Date(article.publishedAt);
        
        switch(dateFilter.type) {
          case 'today':
            return articleDate >= startOfToday;
          case 'week':
            return articleDate >= startOfWeek;
          case 'month':
            return articleDate >= startOfMonth;
          case 'custom':
            const start = new Date(dateFilter.start);
            const end = new Date(dateFilter.end);
            end.setHours(23, 59, 59, 999);
            return articleDate >= start && articleDate <= end;
          default:
            return true;
        }
      });
    }

    // Source filter
    if (selectedSources.length > 0) {
      filtered = filtered.filter(article => 
        selectedSources.includes(article.source?.name)
      );
    }

    setFilteredArticles(filtered);
  }, [articles, dateFilter, selectedSources]);

  const handleSearch = debounce((term) => {
    setSearchTerm(term);
    saveUserPreference('searchTerm', term);
    setPage(1);
    setArticles([]);
  }, 500);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    saveUserPreference('sortOrder', newSortBy);
    setPage(1);
    setArticles([]);
  };

  const handleRetry = () => {
    setError(null);
    setPage(1);
    setArticles([]);
    window.location.reload();
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Gradient */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-600 bg-clip-text text-transparent">
            {category.charAt(0).toUpperCase() + category.slice(1)} News
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Stay updated with the latest headlines
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8"
        >
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          
          <div className="flex items-center gap-2">
            <DateRangeFilter 
              onFilterChange={setDateFilter} 
              currentFilter={dateFilter} 
            />
            <SourceFilter 
              articles={allArticles}
              onFilterChange={setSelectedSources}
              selectedSources={selectedSources}
            />
            <select
              className="glass border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              id="news-sort-order"
              name="news-sort-order"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="publishedAt">Latest First</option>
              <option value="relevancy">Most Relevant</option>
            </select>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-xl mb-6 text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Articles Grid */}
        <motion.div 
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {(filteredArticles.length > 0 ? filteredArticles : articles).map((news, index) => (
            <motion.div
              key={`${news.url}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <NewsItem
                title={news.title}
                description={news.description}
                src={news.image ? news.image : "https://via.placeholder.com/400"}
                url={news.url}
                publishedAt={news.publishedAt}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && articles.length === 0 && !error && (
          <EmptyState type="search" onRetry={handleRetry} />
        )}

        {/* Filtered Empty State */}
        {!loading && filteredArticles.length === 0 && articles.length > 0 && (
          <EmptyState 
            type="search" 
            message="No articles match your filters. Try adjusting your filter criteria." 
          />
        )}

        {/* Error State */}
        {!loading && error && articles.length === 0 && (
          <EmptyState type="error" message={error} onRetry={handleRetry} />
        )}

        {/* Load More Button */}
        {hasMore && !loading && (filteredArticles.length > 0 || articles.length > 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((prevPage) => prevPage + 1)}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Load More Articles
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewsBoard;
