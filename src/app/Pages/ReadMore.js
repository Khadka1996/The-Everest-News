import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultPhoto from "../Components/assets/logo2.png";
import API_URL from "../config";

const ReadMore = ({ onClose, currentArticleId, currentCategory, currentTags }) => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 12;

  const handleArticleClick = async (id) => {
    try {
      await axios.put(`${API_URL}/api/articles/increment-views/${id}`);
    } catch (error) {
      console.error("Error incrementing views:", error);
      setError("Error incrementing views. Please try again later.");
    }
  };

  // ✅ Helper: Optimize article data - fetch only photo and title
  const optimizeArticles = (articles) => {
    return articles
      .filter(article => article._id !== currentArticleId) // Exclude current article
      .slice(0, DEFAULT_LIMIT) // Take exactly 12
      .map(article => ({
        _id: article._id,
        headline: article.headline,
        photos: article.photos || [],
      }));
  };

  // ✅ Fetch similar articles with smart fallback strategy
  const fetchSimilarArticles = async () => {
    try {
      setIsLoading(true);
      let articles = [];
      let fetchedFrom = "unknown";

      // ===== STRATEGY 1: Try to fetch from SAME CATEGORY (fastest & cached) =====
      if (currentCategory) {
        try {
          console.log(`📁 Fetching articles from category: ${currentCategory}`);
          const categoryResponse = await axios.get(
            `${API_URL}/api/articles/category/${encodeURIComponent(currentCategory)}?page=${DEFAULT_PAGE}&limit=${DEFAULT_LIMIT}`
          );
          articles = categoryResponse.data.data || [];
          if (articles.length > 0) {
            fetchedFrom = "category";
            console.log(`✅ Found ${articles.length} articles from category`);
          }
        } catch (categoryError) {
          console.warn(`⚠️ Category fetch failed (will try tags):`, categoryError.message);
        }
      }

      // ===== STRATEGY 2: Try TAGS if category didn't return enough (alternative) =====
      if (articles.length === 0 && currentTags && currentTags.length > 0) {
        try {
          console.log(`🏷️ Fetching articles from tags`);
          // Try first tag
          const tagId = currentTags[0]._id || currentTags[0];
          const tagsResponse = await axios.get(
            `${API_URL}/api/articles/tag/${tagId}/status/published?page=${DEFAULT_PAGE}&limit=${DEFAULT_LIMIT}`
          );
          articles = tagsResponse.data.data || [];
          if (articles.length > 0) {
            fetchedFrom = "tags";
            console.log(`✅ Found ${articles.length} articles from tags`);
          }
        } catch (tagsError) {
          console.warn(`⚠️ Tags fetch failed (will use random):`, tagsError.message);
        }
      }

      // ===== STRATEGY 3: Fallback to RANDOM published articles (if both failed) =====
      if (articles.length === 0) {
        try {
          console.log(`🎲 Fetching random published articles (fallback)`);
          const fallbackResponse = await axios.get(
            `${API_URL}/api/articles/status/published?page=${DEFAULT_PAGE}&limit=${DEFAULT_LIMIT}`
          );
          articles = fallbackResponse.data.data || [];
          if (articles.length > 0) {
            fetchedFrom = "random";
            console.log(`✅ Found ${articles.length} random articles (fallback)`);
          }
        } catch (fallbackError) {
          console.error(`❌ All fetch strategies failed:`, fallbackError.message);
          setError("Unable to load similar articles. Please try again later.");
          setLatestArticles([]);
          setIsLoading(false);
          return;
        }
      }

      // ===== Validate and optimize articles =====
      if (!Array.isArray(articles)) {
        throw new Error("Invalid articles format from API");
      }

      // Sort by creation date (newest first)
      const sortedArticles = articles.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Optimize and take exactly 12
      const optimizedArticles = optimizeArticles(sortedArticles);
      
      console.log(`📊 ReadMore loaded: ${optimizedArticles.length} articles from [${fetchedFrom}]`);
      setLatestArticles(optimizedArticles);
    } catch (error) {
      console.error("Error fetching similar articles:", error);
      setError("Error loading similar articles. Please try again later.");
      setLatestArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilarArticles();
  }, [currentArticleId, currentCategory, currentTags]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {latestArticles.length > 0 && (
        <h2 className="text-2xl font-extrabold text-white bg-[#25609A] py-2 px-6 mb-8 w-full rounded-t-lg shadow-lg text-center md:hover:bg-[#7BB660] md:transition-all md:duration-300 md:ease-in-out">
          छुटाउनुभयो कि ?
        </h2>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-xl h-80 md:animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {latestArticles.map((article, index) => (
            <div
              key={article._id}
              className="bg-white rounded-xl overflow-hidden shadow-lg md:hover:shadow-2xl md:transition-all md:duration-300 cursor-pointer group"
              onClick={() => handleArticleClick(article._id)}
            >
              <a href={`/article/${article._id}`} className="block h-full">
                <div className="relative h-56 overflow-hidden">
                  {article.photos && article.photos.length > 0 ? (
                    <img
                      src={`${API_URL}/uploads/articles/${article.photos[0].split("/").pop()}`}
                      alt={`Article ${index + 1}`}
                      className="w-full h-full object-cover md:transition-transform md:duration-500 md:group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src={defaultPhoto}
                      alt="Default Logo"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300 flex items-end p-4">
                    <span className="text-white font-medium text-sm">
                      पूरा हेर्नुहोस्👉
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-800 md:group-hover:text-blue-600 md:transition-colors">
                    {article.headline}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadMore;