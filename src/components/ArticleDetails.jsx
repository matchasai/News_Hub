import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, Calendar, ExternalLink, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isBookmarked, removeBookmark, saveBookmark } from "../utils/localStorage";
import LoadingSkeleton from "./LoadingSkeleton";
import { useToast } from "./Toast";

const ArticleDetails = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    // Load article from localStorage or state
    const savedArticles = JSON.parse(localStorage.getItem('current-articles') || '[]');
    const found = savedArticles.find(a => btoa(a.url) === articleId);
    
    if (found) {
      setArticle(found);
      setIsSaved(isBookmarked(found.url));
      setLoading(false);
    } else {
      // If not found, redirect back
      navigate('/');
    }
  }, [articleId, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookmark = () => {
    if (isSaved) {
      removeBookmark(article.url);
      setIsSaved(false);
      addToast("Bookmark removed", "info");
    } else {
      saveBookmark(article);
      setIsSaved(true);
      addToast("Article bookmarked!", "success");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
        addToast("Article shared successfully!", "success");
      } catch (err) {
        if (err.name !== 'AbortError') {
          addToast("Failed to share article", "error");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-600 to-accent-500"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-6 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Articles
          </motion.button>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl overflow-hidden shadow-card"
          >
            {/* Hero Image */}
            {article.image && (
              <div className="relative h-96 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {article.source?.name && (
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                    {article.source.name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                {article.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isSaved
                      ? 'bg-yellow-500 text-white'
                      : 'glass hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Bookmark size={20} className={isSaved ? 'fill-white' : ''} />
                  {isSaved ? 'Saved' : 'Save Article'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 glass rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <Share2 size={20} />
                  Share
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all"
                >
                  Read Full Article
                  <ExternalLink size={20} />
                </motion.a>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </>
  );
};

export default ArticleDetails;
