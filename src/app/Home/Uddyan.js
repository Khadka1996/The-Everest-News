'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaClock } from 'react-icons/fa';
import API_URL from '../config';

const ARTICLES_API = `${API_URL}/api/articles/category/उड्डयन/status/published`;
const TRENDING_ARTICLES_API = `${API_URL}/api/articles/trending`;
const AUTHORS_API = `${API_URL}/api/authors`;
const AUTHOR_IMAGE_BASE_URL = `${API_URL}/uploads/authors/`;
const ARTICLE_IMAGE_BASE_URL = `${API_URL}/uploads/articles/`;

const AdvertisementComponent = ({ position }) => {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/advertisements/${position}`);
        setAdvertisements(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(`Error fetching ${position} advertisements:`, error);
        setAdvertisements([]);
      }
    };

    fetchAdvertisements();
  }, [position]);

  const handleAdvertisementClick = (websiteLink) => {
    try {
      const trimmedLink = websiteLink.trim();
      if (trimmedLink.match(/^https?:\/\//i)) {
        window.open(trimmedLink, '_blank');
      } else {
        window.open(`http://${trimmedLink}`, '_blank');
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <div className='flex flex-row justify-center items-center my-4'>
      {advertisements.length > 0 ? (
        <div className="flex flex-wrap justify-center">
          {advertisements.map((advertisement) => (
            <div
              key={advertisement._id}
              className="m-2 cursor-pointer"
              onClick={() => handleAdvertisementClick(advertisement.websiteLink)}
            >
              <img
                className='rounded w-full h-auto'
                src={`${API_URL}/${advertisement.imagePath}`}
                alt="Advertisement"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const TrendingSidebar = () => {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const response = await axios.get(TRENDING_ARTICLES_API);
        setTrendingArticles(response.data.data.slice(0, 7)); // Show top 5 trending
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
        setLoading(false);
      }
    };

    fetchTrendingArticles();
  }, []);

  const handleArticleClick = async (id) => {
    try {
      await axios.put(`${API_URL}/api/articles/increment-views/${id}`);
      router.push(`/article/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  

  return (
    <div className="bg-white p-2 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2 text-[#25609A] border-b pb-2">ट्रेन्डिङ</h3>
      <div className="space-y-2">
        {trendingArticles.map((article) => (
          <div 
            key={article._id} 
            className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => handleArticleClick(article._id)}
          >
            {article.photos && article.photos.length > 0 && (
              <img
                src={`${ARTICLE_IMAGE_BASE_URL}${article.photos[0].split('/').pop()}`}
                alt={article.headline}
                className="w-20 h-16 object-cover rounded"
              />
            )}
            <div>
              <h2 className="font-medium text-m hover:text-[#25609A] line-clamp-2">
                {article.headline}
              </h2>
              <div className="flex items-center text-xs text-gray-500 mt-1">
               
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Uddyan = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticlesAndAuthors = async () => {
      try {
        setError(null);
        const [articlesResponse, authorsResponse] = await Promise.all([
          axios.get(ARTICLES_API, { params: { page: 1, limit: 8 } }),
          axios.get(AUTHORS_API),
        ]);

        const articleData = articlesResponse.data.data || articlesResponse.data;
        let articles = Array.isArray(articleData) ? articleData : [];
        const authors = authorsResponse.data.authors || [];

        const articlesWithAuthorInfo = articles.slice(0, 8).map((article) => {
          const authorNameFromArticle = article.selectedAuthors?.[0]; 
          const author = authors.find((author) => 
            `${author.firstName} ${author.lastName}` === authorNameFromArticle
          );

          const articlePhoto = article.photos && article.photos.length > 0
            ? `${ARTICLE_IMAGE_BASE_URL}${article.photos[0].split('/').pop()}`
            : null;

          return {
            ...article,
            authorName: author ? `${author.firstName} ${author.lastName}` : null,
            authorPhoto: author ? `${AUTHOR_IMAGE_BASE_URL}${author.photo}` : null,
            articlePhoto: articlePhoto,
            authorId: author ? author._id : null,
          };
        });

        setArticles(articlesWithAuthorInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles and authors:', error.response?.data || error.message);
        setError('Error fetching articles. Please try again later.');
        setArticles([]);
        setLoading(false);
      }
    };

    fetchArticlesAndAuthors();
  }, []);

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
      const nepaliNumbers = ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०'];
      return number.toString().split('').map(digit => nepaliNumbers[parseInt(digit, 10) - 1]).join('');
    };

    if (years > 0) return `${toNepaliNumber(years)} वर्ष${years > 1 ? '' : ''} अगाडि`;
    if (months > 0) return `${toNepaliNumber(months)} महिना${months > 1 ? '' : ''} अगाडि`;
    if (days > 0) return `${toNepaliNumber(days)} दिन${days > 1 ? '' : ''} अगाडि`;
    if (hours > 0) return `${toNepaliNumber(hours)} घण्टा${hours > 1 ? '' : ''} अगाडि`;
    if (minutes > 0) return `${toNepaliNumber(minutes)} मिनेट${minutes > 1 ? '' : ''} अगाडि`;

    return `${toNepaliNumber(seconds)} सेकेन्ड${seconds > 1 ? '' : ''} अगाडि`;
  };

  const handleAuthorClick = (authorId) => {
    router.push(`/author/${authorId}`);
  };

  const handleArticleClick = async (id) => {
    console.log(`Article clicked: ${id}`);
    try {
      await axios.put(`${API_URL}/api/articles/increment-views/${id}`);
      router.push(`/article/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  const handleCategoryClick = () => {
    router.push('/category/उड्डयन');
  };

  return (
    <div className="mx-3 md:mx-9 lg:mx-18">
      {loading ? (
        <p className="text-center text-gray-500"></p>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          
          <div className="my-2">
            <h1 className="flex items-center mb-5" onClick={handleCategoryClick}>
              <span className="flex-none block px-4 py-2.5 text-xl cursor-pointer rounded leading-none font-medium bg-[#25609A] text-white hover:bg-[#81BB6C] transition-colors duration-300">
                उड्डयन
              </span>
              <span className="flex-grow block border-t border-[#25609A] ml-4"></span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content area */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {articles.map((article) => (
                  <div key={article._id} className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
                    {article.articlePhoto && (
                      <div className="md:w-1/3">
                        <a
                          href={`/article/${article._id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleArticleClick(article._id);
                          }}
                        >
                          <img
                            src={article.articlePhoto}
                            alt={article.headline}
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        </a>
                      </div>
                    )}
                    <div className="p-4 md:w-2/3">
                      <h2 className="text-lg font-semibold mb-2 cursor-pointer hover:text-[#25609A]">
                        <a
                          href={`/article/${article._id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleArticleClick(article._id);
                          }}
                        >
                          {article.headline}
                        </a>
                      </h2>
                      {article.subheadline && (
                        <h3 className="text-sm text-gray-600 mb-4">{article.subheadline}</h3>
                      )}
                      <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
                        <div className="flex items-center">
                          <FaClock className="mr-2" />
                          <span>{formatTimeDifference(article.updatedAt || article.createdAt)}</span>
                        </div>
                        {article.authorName && (
                          <div className="flex items-center">
                            {article.authorPhoto && (
                              <img
                                src={article.authorPhoto}
                                alt={article.authorName}
                                className="h-8 w-8 rounded-full object-cover mr-2"
                              />
                            )}
                            <span
                              className="cursor-pointer hover:underline"
                              onClick={() =>
                                article.authorId && handleAuthorClick(article.authorId)
                              }
                            >
                              {article.authorName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <TrendingSidebar />
          
            </div>
          </div>
        </>
      )}
      <AdvertisementComponent position="nepali_belowaviation" />
    </div>
  );
};

export default Uddyan;