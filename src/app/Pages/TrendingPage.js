"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultPhoto from '../Components/assets/logo2.png';

const TrendingArticles = () => {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [error, setError] = useState(null);
  const maxArticlesToShow = 9; // Limit the number of articles to display

  const handleArticleClick = async (id) => {
    try {
      await axios.put(`https://api.theeverestnews.com/api/articles/increment-views/${id}`);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const response = await axios.get('https://api.theeverestnews.com/api/articles/trending');
        // Limit the number of articles to display
        const limitedArticles = response.data.data.slice(0, maxArticlesToShow);
        setTrendingArticles(limitedArticles);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
        setError('Network Error. Please connect to the Internet and try again.');
      }
    };

    fetchTrendingArticles();
  }, []);

  return (
    <div className="mx-3 md:mx-9 lg:mx-18">
      {trendingArticles.length > 0 && (
        <h1
          className="text-2xl font-extrabold text-white bg-[#25609A] py-2 px-6 mb-4 w-full rounded-t-lg shadow-lg cursor-pointer hover:bg-[#7BB660] transition-all duration-300 ease-in-out"
        >
          ट्रेन्डिङ
        </h1>
      )}
      {error && <p className="text-red-500 mb-6">{error}</p>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingArticles.map((article) => (
          <li
            key={article._id}
            className="article-item bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            onClick={() => handleArticleClick(article._id)}
          >
            <a href={`/article/${article._id}`} className="block overflow-hidden">
              {article.photos && article.photos.length > 0 ? (
                <img
                  src={`https://api.theeverestnews.com/uploads/articles/${article.photos[0].split('/').pop()}`}
                  alt={`Photo of ${article.headline}`}
                  className="w-full h-48 object-cover rounded-t-xl hover:scale-110 cursor-grab duration-500 ease-in-out"
                />
              ) : (
                <img
                  src={defaultPhoto}
                  alt="Default Logo"
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 cursor-pointer hover:text-[#25609A] duration-100 ease-in-out">
                  {article.headline}
                </h3>
                {/* Additional details or description can be added here */}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingArticles;
