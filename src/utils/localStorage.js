// Local Storage Utility Functions

const STORAGE_KEYS = {
  BOOKMARKS: 'news-app-bookmarks',
  THEME: 'news-app-theme',
  CATEGORY: 'news-app-category',
  SORT_ORDER: 'news-app-sort-order',
  SEARCH_TERM: 'news-app-search-term',
  RECENTLY_VIEWED: 'news-app-recently-viewed',
  USER_PREFERENCES: 'news-app-preferences',
};

// Generic localStorage functions
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

// Bookmarks Management
export const getBookmarks = () => {
  return getFromLocalStorage(STORAGE_KEYS.BOOKMARKS, []);
};

export const saveBookmark = (article) => {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((item) => item.url === article.url);
  
  if (!exists) {
    const newBookmarks = [...bookmarks, { ...article, bookmarkedAt: Date.now() }];
    saveToLocalStorage(STORAGE_KEYS.BOOKMARKS, newBookmarks);
    return true;
  }
  return false;
};

export const removeBookmark = (articleUrl) => {
  const bookmarks = getBookmarks();
  const newBookmarks = bookmarks.filter((item) => item.url !== articleUrl);
  saveToLocalStorage(STORAGE_KEYS.BOOKMARKS, newBookmarks);
};

export const isBookmarked = (articleUrl) => {
  const bookmarks = getBookmarks();
  return bookmarks.some((item) => item.url === articleUrl);
};

// Recently Viewed Management
export const getRecentlyViewed = () => {
  return getFromLocalStorage(STORAGE_KEYS.RECENTLY_VIEWED, []);
};

export const addToRecentlyViewed = (article) => {
  const recentlyViewed = getRecentlyViewed();
  
  // Remove if already exists
  const filtered = recentlyViewed.filter((item) => item.url !== article.url);
  
  // Add to beginning and limit to 20 items
  const updated = [{ ...article, viewedAt: Date.now() }, ...filtered].slice(0, 20);
  
  saveToLocalStorage(STORAGE_KEYS.RECENTLY_VIEWED, updated);
};

// User Preferences Management
export const getUserPreferences = () => {
  return getFromLocalStorage(STORAGE_KEYS.USER_PREFERENCES, {
    theme: 'light',
    category: 'general',
    sortOrder: 'publishedAt',
    searchTerm: '',
  });
};

export const saveUserPreference = (key, value) => {
  const preferences = getUserPreferences();
  preferences[key] = value;
  saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

export const saveUserPreferences = (preferences) => {
  const current = getUserPreferences();
  const updated = { ...current, ...preferences };
  saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, updated);
};

// Clear all app data
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeFromLocalStorage(key);
  });
};

export default {
  getBookmarks,
  saveBookmark,
  removeBookmark,
  isBookmarked,
  getRecentlyViewed,
  addToRecentlyViewed,
  getUserPreferences,
  saveUserPreference,
  saveUserPreferences,
  clearAllData,
};
