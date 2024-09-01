"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultPhoto from "../Components/assets/logo2.png";

const toNepaliNumber = (number) => {
  const nepaliNumbers = ["१", "२", "३", "४", "५", "६", "७", "८", "९", "१०"];
  return number
    .toString()
    .split("")
    .map((digit) => nepaliNumbers[parseInt(digit, 10) - 1])
    .join("");
};

const LatestUpdates = ({ onClose }) => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [error, setError] = useState(null);
  const maxArticlesToShow = 9; // Set the maximum number of articles to display

  const handleArticleClick = async (id) => {
    try {
      await axios.put(
        `https://api.theeverestnews.com/api/articles/increment-views/${id}`
      );
    } catch (error) {
      console.error("Error incrementing views:", error);
      setError("Error incrementing views. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await axios.get(
          "https://api.theeverestnews.com/api/articles/all"
        );
        const sortedArticles = response.data.data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Sort in descending order
        });

        // Limit the number of articles to display
        const limitedArticles = sortedArticles.slice(0, maxArticlesToShow);

        setLatestArticles(limitedArticles);
      } catch (error) {
        console.error("Error fetching latest articles:", error);
        setError("Network Error. Please connect to the Internet and try again.");
      }
    };

    fetchLatestArticles();
  }, []);

  return (
    <div className="p-4">
      {latestArticles.length > 0 && (
        <h2 className="text-xl md:text-2xl font-extrabold text-white bg-[#7BB660] py-2 mt-4 px-4 md:px-6 rounded-t-lg shadow-lg cursor-pointer hover:bg-[#25609A] transition-all duration-300 ease-in-out">
          ताजा अपडेट
        </h2>
      )}
      {error && (
        <p className="error-message-sidebar text-red-500 mb-4">{error}</p>
      )}
      <ul className="articles-list-sidebar space-y-4">
        {latestArticles.map((article, index) => (
          <li
            key={article._id}
            className="article-item-sidebar p-1 bg-white rounded-lg shadow-md hover:bg-gray-100 transition"
            onClick={() => handleArticleClick(article._id)}
          >
            <a
              href={`/article/${article._id}`}
              target="_blank"
              className="article-link flex items-center space-x-4"
            >
              <span className="article-number-sidebar text-m font-normal text-gray-700">
                {toNepaliNumber(index + 1)}
              </span>
              <div className="flex-1">
                <h3 className="article-headline-sidebar text-m font-normal">
                  {article.headline}
                </h3>
              </div>
              {article.photos && article.photos.length > 0 ? (
                <img
                  src={`https://api.theeverestnews.com/uploads/articles/${article.photos[0].split("/").pop()}`}
                  alt={`Article ${index + 1}`}
                  className="article-image w-16 h-16 object-cover rounded-md"
                />
              ) : (
                <img
                  src={defaultPhoto}
                  alt="Default Logo"
                  className="default-logo w-16 h-16 object-cover rounded-md"
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestUpdates;
