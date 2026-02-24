"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaClock } from 'react-icons/fa';
import defaultPhoto from '../Components/assets/logo2.png';
import API_URL from '../config';

const AUTHOR_IMAGE_BASE_URL = `${API_URL}/uploads/authors/`;
const ARTICLE_IMAGE_BASE_URL = `${API_URL}/uploads/articles/`;
const ARTICLES_LIMIT = 15;
const DEFAULT_PAGE = 1;

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
    return number.toString().split('').map(digit => nepaliNumbers[parseInt(digit, 10)]).join('');
  };

  if (years > 0) return `${toNepaliNumber(years)} वर्ष पहिले`;
  if (months > 0) return `${toNepaliNumber(months)} महिना पहिले`;
  if (days > 0) return `${toNepaliNumber(days)} दिन पहिले`;
  if (hours > 0) return `${toNepaliNumber(hours)} घण्टा पहिले`;
  if (minutes > 0) return `${toNepaliNumber(minutes)} मिनेट पहिले`;

  return 'केहि मिनेट पहिले';
};

const ArticleCardSkeleton = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-[150px] bg-gray-200"></div>
      <div className="p-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
};

const AdvertisementComponent = React.memo(({ position }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/advertisements/${position}`);
        setAdvertisements(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(`Error fetching ${position} advertisements:`, error);
        setAdvertisements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, [position]);

  const handleAdvertisementClick = useCallback((websiteLink) => {
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
  }, []);

  if (loading) {
    return (
      <div className='flex flex-row justify-center items-center my-4'>
        <div className="w-full max-w-4xl h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

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
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
});

AdvertisementComponent.displayName = 'AdvertisementComponent';

const TourismArticle = () => {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleArticleClick = useCallback((id) => {
    router.push(`/article/${id}`);
    axios.put(`${API_URL}/api/articles/increment-views/${id}`).catch((error) => {
      console.error('Error incrementing views:', error);
    });
  }, [router]);

  const handleAuthorClick = useCallback((authorId) => {
    if (authorId) {
      router.push(`/author/${authorId}`);
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch authors first
        const authorsResponse = await axios.get(`${API_URL}/api/authors`);
        
        // Fetch articles with error handling for both success and not-found cases
        try {
          const articlesResponse = await axios.get(`${API_URL}/api/articles/category/उड्डयन/status/published`, { 
            params: { page: DEFAULT_PAGE, limit: ARTICLES_LIMIT } 
          });
          
          const articleData = articlesResponse.data.data || articlesResponse.data || [];
          const data = Array.isArray(articleData) ? articleData : [];
          
          if (data.length > 0) {
            const sortedArticles = data.sort((a, b) => a.headline.localeCompare(b.headline));
            setArticles(sortedArticles);
            setAuthors(authorsResponse.data.authors || []);
          } else {
            setArticles([]);
            setAuthors(authorsResponse.data.authors || []);
          }
        } catch (articleError) {
          // Handle 404 or other errors gracefully - show empty state instead of error
          if (articleError.response?.status === 404) {
            console.warn('No articles found for this category');
            setArticles([]);
            setAuthors(authorsResponse.data.authors || []);
          } else {
            throw articleError;
          }
        }
      } catch (error) {
        console.error('Error fetching tourism data:', error.response?.data || error.message);
        setError('Error fetching tourism articles. Please try again later.');
        setArticles([]);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const articlesWithAuthorInfo = useMemo(() => {
    return articles.map((article) => {
      const authorNameFromArticle = article.selectedAuthors?.[0];
      const author = authors.find(
        (author) => `${author.firstName} ${author.lastName}` === authorNameFromArticle
      );

      return {
        ...article,
        authorName: author ? `${author.firstName} ${author.lastName}` : null,
        authorPhoto: author ? `${AUTHOR_IMAGE_BASE_URL}${author.photo}` : null,
        authorId: author ? author._id : null,
        articlePhoto: article.photos && article.photos.length > 0
          ? `${ARTICLE_IMAGE_BASE_URL}${article.photos[0].split('/').pop()}`
          : defaultPhoto,
      };
    });
  }, [articles, authors]);

  return (
    <div className="mx-3 md:mx-10 lg:mx-20 mt-5">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      {(articles.length > 0 || loading) && (
        <h1 className="text-3xl font-semibold mb-4 text-[#7BB660]">उड्डयन</h1>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          {[...Array(15)].map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          {articlesWithAuthorInfo.map((article) => (
            <div 
              key={article._id} 
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              style={{ contentVisibility: 'auto' }}
            >
              <div className="block cursor-pointer" onClick={() => handleArticleClick(article._id)}>
                <img
                  src={article.articlePhoto}
                  alt={article.headline}
                  className="w-full h-[150px] object-cover object-center hover:opacity-80 transition duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-2">
                  <h2 className="mb-2 text-sm line-clamp-2">{article.headline}</h2>
                </div>
              </div>
              
              {article.authorName && (
                <div 
                  className="flex items-center gap-1 px-2 pb-2 text-xs cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => handleAuthorClick(article.authorId)}
                >
                  {article.authorPhoto && article.authorPhoto !== defaultPhoto && (
                    <img
                      src={article.authorPhoto}
                      alt={article.authorName}
                      className="w-5 h-5 rounded-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span className="truncate">{article.authorName}</span>
                </div>
              )}

              <div className="px-2 pb-2 text-xs text-gray-500 flex items-center gap-1">
                <FaClock size={10} />
                <span>{formatTimeDifference(article.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TourismArticle;
