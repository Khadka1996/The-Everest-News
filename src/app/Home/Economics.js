"use client"
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaClock } from 'react-icons/fa';
import LatestUpdates from '../Pages/LatestPage';
import API_URL from '../config';

const ARTICLES_API = `${API_URL}/api/articles/category/अर्थतन्त्र/status/published`;
const AUTHORS_API = `${API_URL}/api/authors`;
const AUTHOR_IMAGE_BASE_URL = `${API_URL}/uploads/authors/`;
const ARTICLE_IMAGE_BASE_URL = `${API_URL}/uploads/articles/`;const ARTICLES_LIMIT = 4;
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

const AdvertisementComponent = React.memo(({ position }) => {
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

  const handleAdvertisementClick = useCallback((websiteLink) => {
    try {
      const url = websiteLink.startsWith('http') ? websiteLink.trim() : `http://${websiteLink.trim()}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening link:', error);
    }
  }, []);

  if (advertisements.length === 0) return null;

  return (
    <div className='flex flex-col justify-center items-center my-4'>
      <div className='flex flex-col items-center'>
        {advertisements.map((advertisement) => (
          <div
            key={advertisement._id}
            className='mb-2 cursor-pointer'
            onClick={() => handleAdvertisementClick(advertisement.websiteLink)}
          >
            <img
              className='rounded w-full h-auto'
              src={`${API_URL}/${advertisement.imagePath}`}
              alt='Advertisement'
              loading='lazy'
              decoding='async'
            />
          </div>
        ))}
      </div>
    </div>
  );
});
AdvertisementComponent.displayName = 'AdvertisementComponent';

const Economics = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticlesAndAuthors = async () => {
      try {
        const [articlesResponse, authorsResponse] = await Promise.all([
          axios.get(ARTICLES_API, { params: { page: DEFAULT_PAGE, limit: ARTICLES_LIMIT } }),
          axios.get(AUTHORS_API),
        ]);

        const articles = articlesResponse.data.data;
        const authors = authorsResponse.data.authors;

        const articlesWithAuthorInfo = articles.slice(0, 6).map((article) => {
          const authorNameFromArticle = article.selectedAuthors[0]; 

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
        console.error('Error fetching articles and authors:', error);
        setError('Error fetching articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticlesAndAuthors();
  }, []);

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

  const handleCategoryClick = useCallback(() => {
    router.push('/category/अर्थतन्त्र');
  }, [router]);

  if (loading) {
    return <p className='text-center text-gray-500'>Loading...</p>;
  }

  return (
    <div className="mx-3 md:mx-6 lg:mx-12">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          {loading ? (
            <p className="text-center text-gray-500"></p>
          ) : (
            <>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <AdvertisementComponent position="middle" />
              <div className="my-2">
                <h1
                  className="flex items-center mb-5"
                  onClick={handleCategoryClick}
                >
                   <span className="flex-none block px-4 py-2.5 text-xl cursor-pointer rounded leading-none font-medium bg-[#25609A] text-white hover:bg-[#81BB6C] transition-colors duration-300">
                   अर्थतन्त्र
                </span>
              <span className="flex-grow block border-t border-[#25609A] ml-4"></span>
                  
                </h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                 {articles.map((article) => (
                  <div key={article._id} className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ contentVisibility: 'auto' }}>
                    {article.articlePhoto ? (
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
                          className="w-full h-48 md:h-56 object-cover cursor-pointer"
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                    ) : (
                      <p className="text-center p-4 text-gray-500">Article photo not available</p>
                    )}
                    <div className="p-4">
                      <h2 className="text-base md:text-lg font-semibold mb-2 cursor-pointer hover:text-[#25609A]">
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
                      <div className="flex items-center justify-between text-gray-600 text-xs md:text-sm mb-2">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{formatTimeDifference(article.createdAt)}</span>
                        </div>
                        <button
                          onClick={() => handleAuthorClick(article.authorId)}
                          className="flex items-center text-brown-700 hover:text-[#25609A]"
                        >
                          {article.authorPhoto && (
                            <img
                              src={article.authorPhoto}
                              alt={article.authorName}
                              className="w-8 h-8 rounded-full mr-2"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          {article.authorName}
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <AdvertisementComponent position="bottom" />
            </>
          )}
        </div>
        <div className="md:w-1/3">
        <LatestUpdates />
        </div>
      </div>
    </div>
  );
};

export default Economics;
