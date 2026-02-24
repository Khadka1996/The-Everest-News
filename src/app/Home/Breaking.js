'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaClock } from 'react-icons/fa';
import API_URL from '../config';

// API Endpoints
const ARTICLES_API = `${API_URL}/api/articles/category/Breaking/status/published`;
const AUTHORS_API = `${API_URL}/api/authors`;
const AUTHOR_IMAGE_BASE_URL = `${API_URL}/uploads/authors/`;
const ARTICLE_IMAGE_BASE_URL = `${API_URL}/uploads/articles/`;
const ARTICLES_LIMIT = 3;
const DEFAULT_PAGE = 1;

// Advertisement Component - Memoized to prevent unnecessary re-renders
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
    <div className="flex flex-row justify-center items-center my-4">
      <div className="flex flex-wrap justify-center">
        {advertisements.map((advertisement) => (
          <div
            key={advertisement._id}
            className="m-2 cursor-pointer"
            onClick={() => handleAdvertisementClick(advertisement.websiteLink)}
          >
            <img
              className="rounded w-full h-auto"
              src={`${API_URL}/${advertisement.imagePath}`}
              alt="Advertisement"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
});
AdvertisementComponent.displayName = 'AdvertisementComponent';

// Loading Skeleton Component - Minimal for faster render
const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-8">
        {[1, 2].map((item) => (
          <div key={item} className="bg-white shadow-md rounded-md overflow-hidden" style={{ contentVisibility: 'auto' }}>
            <div className="p-6 space-y-4">
              <div className="h-8 md:h-12 lg:h-16 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
              <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-full h-48 md:h-64 lg:h-96 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Optimized time formatter - moved outside component
const formatTimeDifference = (timestamp) => {
  if (!timestamp) return "समय उपलब्ध छैन";

  const diff = Date.now() - new Date(timestamp).getTime();
  if (isNaN(diff)) return "समय उपलब्ध छैन";

  const units = [
    { label: 'वर्ष', value: 365 * 24 * 60 * 60 * 1000 },
    { label: 'महिना', value: 30 * 24 * 60 * 60 * 1000 },
    { label: 'दिन', value: 24 * 60 * 60 * 1000 },
    { label: 'घण्टा', value: 60 * 60 * 1000 },
    { label: 'मिनेट', value: 60 * 1000 },
    { label: 'सेकेन्ड', value: 1000 },
  ];

  for (const { label, value } of units) {
    const unitValue = Math.floor(diff / value);
    if (unitValue > 0) {
      return `${unitValue} ${label} अगाडि`;
    }
  }

  return 'केहि मिनेट पहिले';
};

// Memoized Article Card Component - Optimized for render speed
const ArticleCard = React.memo(({ article, onArticleClick, onAuthorClick }) => {
  return (
    <div
      className="bg-white shadow-md rounded-md overflow-hidden"
      onClick={() => onArticleClick(article._id)}
      style={{ contentVisibility: 'auto' }}
    >
      <div className="p-6 space-y-4">
        <h2
          className="text-xl md:text-3xl lg:text-5xl font-bold text-center cursor-pointer hover:text-[#25609A] transition duration-150 ease-in-out"
          style={{ lineHeight: '1.3' }}
        >
          {article.headline}
        </h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaClock className="text-[#25609A]" />
            <span>{formatTimeDifference(article.createdAt)}</span>
          </div>
          {article.authorName && (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAuthorClick(article.authorId);
              }}
            >
              {article.authorPhoto ? (
                <img
                  src={article.authorPhoto}
                  alt={article.authorName}
                  className="w-8 h-8 rounded-full object-cover shadow-sm"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {article.authorName.charAt(0)}
                </div>
              )}
              <span className="font-medium hover:text-[#25609A]">
                {article.authorName}
              </span>
            </div>
          )}
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-md cursor-pointer">
          {article.articlePhoto && (
            <img
              src={article.articlePhoto}
              alt={article.headline}
              className="w-full h-48 md:h-64 lg:h-auto object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
        {article.subheadline && (
          <p className="text-gray-700 text-center">{article.subheadline}</p>
        )}
      </div>
    </div>
  );
});
ArticleCard.displayName = 'ArticleCard';

// Breaking News Component - Optimized
const Breaking = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBreakingArticlesAndAuthors = async () => {
      try {
        const [articlesResponse, authorsResponse] = await Promise.all([
          axios.get(ARTICLES_API, { params: { page: DEFAULT_PAGE, limit: ARTICLES_LIMIT } }),
          axios.get(AUTHORS_API),
        ]);

        const articlesData = articlesResponse.data.data;
        const authorsData = authorsResponse.data.authors;

        const processedArticles = articlesData.map((article) => {
            const author = authorsData.find(
              (author) =>
                `${author.firstName} ${author.lastName}` === article.selectedAuthors[0]
            );

            return {
              ...article,
              authorName: author ? `${author.firstName} ${author.lastName}` : 'The Everest News',
              authorPhoto: author?.photo ? `${AUTHOR_IMAGE_BASE_URL}${author.photo}` : null,
              authorId: author?._id || null,
              articlePhoto: article.photos?.length
                ? `${ARTICLE_IMAGE_BASE_URL}${article.photos[0].split('/').pop()}`
                : null,
            };
          });

        setArticles(processedArticles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching breaking articles and authors:', error);
        setError('Failed to load breaking articles.');
        setLoading(false);
      }
    };

    fetchBreakingArticlesAndAuthors();
  }, []);

  // Non-blocking view increment - happens in background
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

  return (
    <>
      <AdvertisementComponent position="nepali_top" />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                onArticleClick={handleArticleClick}
                onAuthorClick={handleAuthorClick}
              />
            ))}
          </div>
        </div>
      )}

      <AdvertisementComponent position="nepali_belowbreaking" />
    </>
  );
};

export default Breaking;