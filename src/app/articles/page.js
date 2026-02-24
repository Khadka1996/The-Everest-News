'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaClock } from 'react-icons/fa';
import NavbarTop from '@/app/Components/Header/TopHeader';
import Heading from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import API_URL from '@/app/config';

const AUTHOR_IMAGE_BASE_URL = `${API_URL}/uploads/authors/`;
const ARTICLE_IMAGE_BASE_URL = `${API_URL}/uploads/articles/`;
const ARTICLES_PER_PAGE = 21;
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

// Loading Skeleton Component
const LoadingSkeleton = () => {
  return (
    <div className="mx-3 md:mx-10 lg:mx-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {[...Array(21)].map((_, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-md overflow-hidden ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
            <div className="w-full bg-gray-200 animate-pulse" style={{ height: index === 0 ? '400px' : '160px' }}></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Advertisement Component with Skeleton Loading
const AdvertisementComponent = React.memo(({ position }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setLoading(true);
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
      const url = websiteLink.startsWith('http') ? websiteLink.trim() : `http://${websiteLink.trim()}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening link:', error);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-row justify-center items-center my-4">
        <div className="w-full max-w-4xl h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (advertisements.length === 0) return null;

  return (
    <div className='flex flex-row justify-center items-center my-4'>
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

const HomePage = ({ params }) => {
  const { categoryName } = params;
  const decodedCategoryName = decodeURIComponent(categoryName);
  const [articles, setArticles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const articlesPerPage = 21;

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

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (decodedCategoryName) {
      setLoading(true);
      Promise.all([
        axios.get(`${API_URL}/api/articles/status/published`, { params: { page: currentPage, limit: ARTICLES_PER_PAGE } }),
        axios.get(`${API_URL}/api/authors`)
      ])
        .then(([articlesResponse, authorsResponse]) => {
          const sortedArticles = articlesResponse.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setArticles(sortedArticles);
          setAuthors(authorsResponse.data.authors || []);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setError('Error fetching articles. Please try again later.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [decodedCategoryName, currentPage]);

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
          : null,
      };
    });
  }, [articles, authors]);

  const totalPages = Math.ceil(articlesWithAuthorInfo.length / articlesPerPage);

  const startIndex = (currentPage - 1) * articlesPerPage;
  const displayedArticles = useMemo(() => 
    articlesWithAuthorInfo.slice(startIndex, startIndex + articlesPerPage),
    [articlesWithAuthorInfo, startIndex]
  );

  const convertToNepaliNumber = (num) => {
    const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(digit => nepaliNumbers[parseInt(digit)]).join('');
  };

  return (
    <div className=''>
      <NavbarTop />
      <Heading />
      <BottomHeader />
      <AdvertisementComponent position="nepali_top" />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="mx-3 md:mx-10 lg:mx-20">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {displayedArticles.map((article, index) => (
              <li key={article._id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`} style={{ contentVisibility: 'auto' }}>
                <div className="block cursor-pointer" onClick={() => handleArticleClick(article._id)}>
                  {article.articlePhoto && (
                    <img
                      src={article.articlePhoto}
                      alt={article.headline}
                      className={`w-full ${index === 0 ? 'h-96' : 'h-40'} object-cover`}
                      loading='lazy'
                      decoding='async'
                    />
                  )}
                  <div className="p-4">
                    <h2 className={`text-${index === 0 ? '2xl' : 'lg'} font-semibold text-gray-800 hover:text-[#25609A] line-clamp-${index === 0 ? '3' : '2'}`}>
                      {article.headline}
                    </h2>
                  </div>
                </div>

                {article.authorName && (
                  <div 
                    className="flex items-center gap-2 px-4 pb-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors mx-4 mb-3"
                    onClick={() => handleAuthorClick(article.authorId)}
                  >
                    {article.authorPhoto && (
                      <img
                        src={article.authorPhoto}
                        alt={article.authorName}
                        className="w-8 h-8 rounded-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">{article.authorName}</p>
                    </div>
                  </div>
                )}

                <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaClock size={12} />
                    {formatTimeDifference(article.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 my-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                आगे
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                if (totalPages <= 5) return i + 1;
                if (currentPage <= 3) return i + 1;
                if (currentPage >= totalPages - 2) return totalPages - 4 + i;
                return currentPage - 2 + i;
              }).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {convertToNepaliNumber(page)}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                पछाडी
              </button>
            </div>
          )}
        </div>
      )}

      <AdvertisementComponent position="nepali_bottom" />
      <FooterBottom />
    </div>
  );
};

export default HomePage;