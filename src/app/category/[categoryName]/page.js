'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaSearch, FaTimes, FaClock } from 'react-icons/fa';
import NavbarTop from '@/app/Components/Header/TopHeader';
import Heading from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import API_URL from '@/app/config';

const AUTHOR_IMAGE_BASE_URL = `${API_URL}/uploads/authors/`;
const ARTICLE_IMAGE_BASE_URL = `${API_URL}/uploads/articles/`;

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
        <div className="w-full h-40 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

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
                src={`${API_URL}/${advertisement.imagePath}`}
                alt="Advertisement"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

AdvertisementComponent.displayName = 'AdvertisementComponent';

const ArticleCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};
const CategoryPage = ({ params }) => {
  const { categoryName } = params;
  const decodedCategoryName = decodeURIComponent(categoryName);
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    pageSize: 12,
    totalCount: 0
  });
  const searchInputRef = useRef(null);

  // Fetch articles when category, page or search changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesResponse, authorsResponse] = await Promise.all([
          axios.get(
            `${API_URL}/api/articles/category/${decodedCategoryName}/status/published`, 
            {
              params: { 
                page: pagination.currentPage, 
                limit: pagination.pageSize,
                search: searchQuery
              }
            }
          ),
          axios.get(`${API_URL}/api/authors`)
        ]);

        const { data, pagination: pageInfo } = articlesResponse.data;
        setArticles(data);
        setAuthors(authorsResponse.data.authors || []);
        setPagination(prev => ({
          ...prev,
          totalPages: pageInfo.totalPages,
          totalCount: pageInfo.totalCount
        }));
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Error fetching articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (decodedCategoryName) {
      fetchData();
    }
  }, [decodedCategoryName, pagination.currentPage, searchQuery]);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

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

  const convertToNepaliNumber = (num) => {
    const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(digit => nepaliNumbers[parseInt(digit)]).join('');
  };

  const handlePageChange = useCallback((pageNumber) => {
    setPagination(prev => ({ ...prev, currentPage: pageNumber }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
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
          : null,
      };
    });
  }, [articles, authors]);

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, pagination.currentPage - halfVisible);
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Always show first page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center ${pagination.currentPage === 1 ? 'bg-[#7BB761] text-white' : 'bg-[#25609A] text-white'}`}
        >
          {convertToNepaliNumber(1)}
        </button>
      );

      // Show ellipsis if needed
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="mx-1 flex items-center">
            ...
          </span>
        );
      }
    }

    // Visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center ${pagination.currentPage === i ? 'bg-[#7BB761] text-white' : 'bg-[#25609A] text-white'}`}
        >
          {convertToNepaliNumber(i)}
        </button>
      );
    }

    // Show ellipsis and last page if needed
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="mx-1 flex items-center">
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center ${pagination.currentPage === pagination.totalPages ? 'bg-[#7BB761] text-white' : 'bg-[#25609A] text-white'}`}
        >
          {convertToNepaliNumber(pagination.totalPages)}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-8 mb-4">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="mx-2 px-3 py-1 rounded bg-[#25609A] text-white disabled:opacity-50"
        >
          पछिल्लो
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="mx-2 px-3 py-1 rounded bg-[#25609A] text-white disabled:opacity-50"
        >
          अर्को
        </button>
      </div>
    );
  };

  return (
    <div className=''>
      <NavbarTop />
      <Heading />
      <BottomHeader />
      <AdvertisementComponent position="nepali_top" />
      
      {/* Search Bar */}
      <div className="mx-3 md:mx-10 lg:mx-20 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{decodedCategoryName}</h1>
          <button 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search articles"
          >
            <FaSearch className={`text-2xl mb-1 ${showSearch ? 'text-[#25609A]' : 'text-gray-500'}`} />
            <span className="text-xs">Search</span>
          </button>
        </div>
        
        {showSearch && (
          <form onSubmit={handleSearch} className="relative mt-4">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search articles by headline..."
              className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25609A]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-4 text-gray-400" />
            {searchQuery && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </form>
        )}
      </div>

      {/* Article List */}
      <div className="mx-3 md:mx-10 lg:mx-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(pagination.pageSize)].map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 text-center my-4">{error}</p>}
            
            {articles.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  {searchQuery ? `No articles found for "${searchQuery}"` : 'No articles found in this category'}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-2 text-[#25609A] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {articlesWithAuthorInfo.map(article => (
                    <li key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden" style={{ contentVisibility: 'auto' }}>
                      <div className="block cursor-pointer" onClick={() => handleArticleClick(article._id)}>
                        {article.articlePhoto ? (
                          <img
                            src={article.articlePhoto}
                            alt={article.headline}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-500">No image available</span>
                          </div>
                        )}
                        <div className="p-4">
                          <h2 className="text-lg font-semibold text-gray-800 mb-3">
                            {article.headline}
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-4 pb-3 text-gray-600 text-sm">
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-xs" />
                          <span>{formatTimeDifference(article.createdAt)}</span>
                        </div>
                        {article.authorName && (
                          <div className="flex items-center">
                            {article.authorPhoto && (
                              <img
                                src={article.authorPhoto}
                                alt={article.authorName}
                                className="h-6 w-6 rounded-full object-cover mr-2"
                              />
                            )}
                            <span
                              className="cursor-pointer hover:underline hover:text-[#25609A]"
                              onClick={() =>
                                article.authorId && handleAuthorClick(article.authorId)
                              }
                            >
                              {article.authorName}
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {renderPagination()}
              </>
            )}
          </>
        )}
      </div>
      <AdvertisementComponent position="nepali_bottom" />
      <FooterBottom />
    </div>
  );
};

export default CategoryPage;