import { motion } from "framer-motion";
import { Bookmark, Clock, ExternalLink, Eye, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultImage from "../assets/image.png";
import { addToRecentlyViewed, isBookmarked, removeBookmark, saveBookmark } from "../utils/localStorage";
import { useToast } from "./Toast";

const NewsItem = ({ title, description, src, url, publishedAt, isBookmarked: initialBookmarked }) => {
  const [isSaved, setIsSaved] = useState(initialBookmarked || false);
  const [imageError, setImageError] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setIsSaved(isBookmarked(url));
  }, [url]);

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = defaultImage;
    e.target.onerror = null;
  };

  const truncateText = (text, maxLength) =>
    text ? (text.length > maxLength ? text.substring(0, maxLength) + "..." : text) : "No description available";

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text?.split(/\s+/)?.length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      addToast("Share feature not supported on this browser", "warning");
      return;
    }
    
    setIsSharing(true);
    try {
      await navigator.share({ title, text: description, url });
      addToast("Article shared successfully!", "success");
    } catch (err) {
      if (err.name !== 'AbortError') {
        addToast("Failed to share article", "error");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleBookmark = () => {
    const article = { title, description, url, image: src, publishedAt };
    
    if (isSaved) {
      removeBookmark(url);
      setIsSaved(false);
      addToast("Bookmark removed", "info");
    } else {
      saveBookmark(article);
      setIsSaved(true);
      addToast("Article bookmarked!", "success");
    }
  };

  const handleArticleClick = () => {
    const article = { title, description, url, image: src, publishedAt };
    addToRecentlyViewed(article);
  };

  return (
    <motion.article
      className="glass rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={imageError ? defaultImage : src || defaultImage}
          alt={title || "News image"}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white transition"
            onClick={handleBookmark}
            aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark size={16} className={isSaved ? "fill-yellow-400 text-yellow-400" : "text-gray-700 dark:text-gray-300"} />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {truncateText(title, 80)}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {truncateText(description, 150)}
        </p>

        {/* Meta Info */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{calculateReadingTime(description)} min read</span>
          </span>
          <time className="font-medium">{new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2">
                    <Link
                      to={`/article/${btoa(url)}`}
                      onClick={handleArticleClick}
                      className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm group/link"
                    >
                      <Eye size={14} />
                      View Details
                    </Link>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={url}
            onClick={handleArticleClick}
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm group/link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Full Article
            <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            onClick={handleShare}
            aria-label="Share article"
            disabled={isSharing}
            title={isSharing ? "Sharing..." : "Share this article"}
          >
            <Share2 size={16} className={`${isSharing ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsItem;
