'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaClock } from 'react-icons/fa';

// API Endpoints
const ARTICLES_API = 'https://api.theeverestnews.com/api/articles/category/Breaking';
const AUTHORS_API = 'https://api.theeverestnews.com/api/authors';
const AUTHOR_IMAGE_BASE_URL = 'https://api.theeverestnews.com/uploads/authors/';
const ARTICLE_IMAGE_BASE_URL = 'https://api.theeverestnews.com/uploads/articles/';

// Advertisement Component
const AdvertisementComponent = ({ position }) => {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`https://api.theeverestnews.com/api/advertisements/${position}`);
        setAdvertisements(response.data.advertisements);
      } catch (error) {
        console.error(`Error fetching ${position} advertisements:`, error);
      }
    };

    fetchAdvertisements();
  }, [position]);

  const handleAdvertisementClick = (websiteLink) => {
    try {
      const trimmedLink = websiteLink.trim();
      const url = trimmedLink.match(/^https?:\/\//i) ? trimmedLink : `http://${trimmedLink}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <div className='flex flex-row justify-center items-center my-4'>
      {advertisements.length > 0 && (
        <div className="flex flex-wrap justify-center">
          {advertisements.map((advertisement) => (
            <div
              key={advertisement._id}
              className="m-2 cursor-pointer"
              onClick={() => handleAdvertisementClick(advertisement.websiteLink)}
            >
              <img
                className='rounded w-full h-auto'
                src={`https://api.theeverestnews.com/${advertisement.imagePath}`}
                alt="Advertisement"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Breaking News Component
const Breaking = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBreakingArticlesAndAuthors = async () => {
      try {
        // Fetch articles and authors concurrently
        const [articlesResponse, authorsResponse] = await Promise.all([
          axios.get(ARTICLES_API),
          axios.get(AUTHORS_API),
        ]);

        const articlesData = articlesResponse.data.data;
        const authorsData = authorsResponse.data.authors;

        // Process and map articles with their respective authors
        const processedArticles = articlesData
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .slice(0, 3) // Limit articles to 3
          .map((article) => {
            const authorNameFromArticle = article.selectedAuthors[0];

            const author = authorsData.find(
              (author) =>
                `${author.firstName} ${author.lastName}` === authorNameFromArticle
            );

            const articlePhoto = article.photos && article.photos.length > 0
              ? `${ARTICLE_IMAGE_BASE_URL}${article.photos[0].split('/').pop()}`
              : null;

            return {
              ...article,
              authorName: author ? `${author.firstName} ${author.lastName}` : 'Unknown Author',
              authorPhoto: author && author.photo ? `${AUTHOR_IMAGE_BASE_URL}${author.photo}` : null,
              authorId: author ? author._id : null,
              articlePhoto: articlePhoto,
            };
          });

        setArticles(processedArticles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching breaking articles and authors:', error);
        setError('Error fetching breaking articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchBreakingArticlesAndAuthors();
  }, []);

  const handleArticleClick = async (id) => {
    try {
      await axios.put(`https://api.theeverestnews.com/api/articles/increment-views/${id}`);
      router.push(`/article/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  const handleAuthorClick = (authorId) => {
    if (authorId) {
      router.push(`/author/${authorId}`);
    }
  };

  const formatTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const articleTime = new Date(timestamp);

    const timeDifference = currentTime - articleTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const toNepaliNumber = (number) => {
      const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      return number
        .toString()
        .split('')
        .map((digit) => nepaliNumbers[parseInt(digit, 10)] || digit)
        .join('');
    };

    if (years > 0) return `${toNepaliNumber(years)} वर्ष अगाडि`;
    if (months > 0) return `${toNepaliNumber(months)} महिना अगाडि`;
    if (days > 0) return `${toNepaliNumber(days)} दिन अगाडि`;
    if (hours > 0) return `${toNepaliNumber(hours)} घण्टा अगाडि`;
    if (minutes > 0) return `${toNepaliNumber(minutes)} मिनेट अगाडि`;

    return `${toNepaliNumber(seconds)} सेकेन्ड अगाडि`;
  };

  return (
    <>
      <AdvertisementComponent position="top" />

      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl"></p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center my-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white shadow-md rounded-md overflow-hidden"
              >
               

                <div className="p-6">
                  <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-center cursor-pointer hover:text-[#25609A] transition duration-100 ease-in-out"
                    onClick={() => handleArticleClick(article._id)}
                  >
                    {article.headline}
                  </h2>
                  {article.subheadline && (
                    <p className="text-gray-700 text-center mt-2">{article.subheadline}</p>
                  )}
                  <div className="flex justify-center items-center gap-2 text-sm font-normal text-gray-700 mt-2">
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      <span>{formatTimeDifference(article.createdDate)}</span>
                    </div>
                    {article.authorName && (
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleAuthorClick(article.authorId)}
                      >
                        {article.authorPhoto ? (
                          <img
                            src={article.authorPhoto}
                            alt={article.authorName}
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                            <span className="text-white font-bold">
                              {article.authorName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span>{article.authorName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdvertisementComponent position="bottom" />
    </>
  );
};

export default Breaking;
