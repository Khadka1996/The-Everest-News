import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultPhoto from "../Components/assets/logo2.png";

const ReadMore = ({ onClose }) => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [error, setError] = useState(null);
  const maxArticlesToShow = 12; // Set the maximum number of articles to display

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
        setError("Error fetching latest articles. Please try again later.");
      }
    };

    fetchLatestArticles();
  }, []);

  return (
    <div className="">
      {latestArticles.length > 0 && (
        <h2
          className="text-2xl font-extrabold text-white bg-[#25609A] py-2 px-6 mb-8 w-full rounded-t-lg shadow-lg text-center hover:bg-[#7BB660] transition-all duration-300 ease-in-out"
        >
          छुटाउनुभयो कि ?
        </h2>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestArticles.map((article, index) => (
          <div
            key={article._id}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => handleArticleClick(article._id)}
          >
            <a href={`/article/${article._id}`} className="block">
              <div className="h-48 overflow-hidden">
                {article.photos && article.photos.length > 0 ? (
                  <img
                    src={`https://api.theeverestnews.com/uploads/articles/${article.photos[0].split("/").pop()}`}
                    alt={`Article ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={defaultPhoto}
                    alt="Default Logo"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {article.headline}
                </h3>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadMore;
