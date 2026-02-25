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
            `${API_URL}/api/articles/category/${encodeURIComponent(currentCategory)}?page=${DEFAULT_PAGE}&limit=${DEFAULT_LIMIT * 2}`
          );
          articles = categoryResponse.data.data || [];
          if (articles.length >= DEFAULT_LIMIT) {
            fetchedFrom = "category";
            console.log(`✅ Found ${articles.length} articles from category`);
          }
        } catch (categoryError) {
          console.warn(`⚠️ Category fetch failed (will try tags):`, categoryError.message);
        }
      }

      // ===== STRATEGY 2: Try TAGS if category didn't return enough (alternative) =====
      if (articles.length < DEFAULT_LIMIT && currentTags && currentTags.length > 0) {
        try {
          console.log(`🏷️ Fetching articles from tags`);
          // Try first tag
          const tagId = currentTags[0]._id || currentTags[0];
          const tagsResponse = await axios.get(
            `${API_URL}/api/articles/tag/${tagId}/status/published?page=${DEFAULT_PAGE}&limit=${DEFAULT_LIMIT * 2}`
          );
          const tagArticles = tagsResponse.data.data || [];
          if (tagArticles.length > 0) {
            articles = [...articles, ...tagArticles];
            fetchedFrom = articles.length >= DEFAULT_LIMIT ? "tags" : "category+tags";
            console.log(`✅ Found ${tagArticles.length} articles from tags`);
          }
        } catch (tagsError) {
          console.warn(`⚠️ Tags fetch failed (will use random):`, tagsError.message);
        }
      }

      // ===== STRATEGY 3: Fallback to ALL published articles (if both failed) =====
      if (articles.length < DEFAULT_LIMIT) {
        try {
          console.log(`🎲 Fetching published articles (fallback)`);
          const fallbackResponse = await axios.get(
            `${API_URL}/api/articles/status/published?page=${DEFAULT_PAGE}&limit=${DEFAULT_LIMIT * 3}`
          );
          const fallbackArticles = fallbackResponse.data.data || [];
          if (fallbackArticles.length > 0) {
            articles = [...articles, ...fallbackArticles];
            fetchedFrom = articles.length >= DEFAULT_LIMIT ? "published" : "mixed";
            console.log(`✅ Found ${fallbackArticles.length} published articles`);
          }
        } catch (fallbackError) {
          console.error(`❌ All fetch strategies failed:`, fallbackError.message);
          setError("Unable to load articles. Please try again later.");
          setLatestArticles([]);
          setIsLoading(false);
          return;
        }
      }

      // ===== Validate and optimize articles =====
      if (!Array.isArray(articles)) {
        throw new Error("Invalid articles format from API");
      }

      // Remove duplicates and current article
      const uniqueArticles = Array.from(
        new Map(articles.map(article => [article._id, article])).values()
      ).filter(article => article._id !== currentArticleId);

      // Sort by creation date (newest first)
      const sortedArticles = uniqueArticles.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Take exactly 12
      const finalArticles = sortedArticles.slice(0, DEFAULT_LIMIT).map(article => ({
        _id: article._id,
        headline: article.headline,
        photos: article.photos || [],
      }));
      
      console.log(`📊 ReadMore loaded: ${finalArticles.length} articles from [${fetchedFrom}]`);
      setLatestArticles(finalArticles);
    } catch (error) {
      console.error("Error fetching similar articles:", error);
      setError("Error loading articles. Please try again later.");
      setLatestArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilarArticles();
  }, [currentArticleId, currentCategory, currentTags]);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {latestArticles.length > 0 && (
        <h2 className="text-3xl font-extrabold text-white bg-gradient-to-r from-[#25609A] to-[#1a3f5a] py-3 px-6 mb-6 rounded-lg shadow-md text-center">
          छुटाउनुभयो कि ?
        </h2>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-lg h-72 shadow-sm"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestArticles.map((article, index) => (
            <div
              key={article._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => handleArticleClick(article._id)}
            >
              <a href={`/article/${article._id}`} className="block h-full">
                <div className="relative h-52 overflow-hidden bg-gray-300">
                  {article.photos && article.photos.length > 0 ? (
                    <img
                      src={`${API_URL}/uploads/articles/${article.photos[0].split("/").pop()}`}
                      alt={article.headline}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={defaultPhoto}
                      alt="Default Logo"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-base font-bold line-clamp-2 text-gray-800 mb-2 hover:text-[#25609A]">
                    {article.headline}
                  </h3>
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