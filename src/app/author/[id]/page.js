'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import NavbarTop from '@/app/Components/Header/TopHeader';
import Heading from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import LowerHeading from '@/app/Components/Footer/LowerHeading';
import API_URL from '@/app/config';
import Loader from "@/app/articless/loader";

const AuthorPage = ({ params }) => {
  const { id } = params;
  const [articles, setArticles] = useState([]);
  const [authorInfo, setAuthorInfo] = useState({});
  const [advertisements, setAdvertisements] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ articles: null, advertisements: null });
  const articlesPerPage = 12;

  const fetchArticles = async (page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/articles/authors/${id}/published`, {
        params: { page, limit: articlesPerPage },
      });
      setArticles(res.data.data);
      setPagination({
        currentPage: res.data.pagination.page,
        totalPages: res.data.pagination.totalPages,
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError((prev) => ({ ...prev, articles: 'Error fetching articles. Please try again later.' }));
    } finally {
      setLoading(false);
    }
  };

  const generatePageNumbers = () => {
    const range = 2;
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
  
    let pageNumbers = [];
  
    if (currentPage - range > 1) {
      pageNumbers.push(1);
    }
  
    for (let i = currentPage - range; i < currentPage; i++) {
      if (i > 0) pageNumbers.push(i);
    }
  
    pageNumbers.push(currentPage);
  
    for (let i = currentPage + 1; i <= currentPage + range; i++) {
      if (i <= totalPages) pageNumbers.push(i);
    }
  
    if (currentPage + range < totalPages) {
      pageNumbers.push(totalPages);
    }
  
    return pageNumbers;
  };

  const handlePageChange = (pageNumber) => {
    fetchArticles(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchAuthor = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/authors/${id}`);
      setAuthorInfo(res.data.author || {});
    } catch (error) {
      console.error('Error fetching author information:', error);
      setError((prev) => ({ ...prev, author: 'Error fetching author information. Please try again later.' }));
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const [topAds, belowAuthorAds] = await Promise.all([
        axios.get(`${API_URL}/api/advertisements/nepali_top`),
        axios.get(`${API_URL}/api/advertisements/nepali_belowauthor`)
      ]);
      setAdvertisements({
        nepali_top: topAds.data.advertisements,
        nepali_belowauthor: belowAuthorAds.data.advertisements,
      });
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      setError((prev) => ({ ...prev, advertisements: 'Error fetching advertisements. Please try again later.' }));
    }
  };

  const handleAdvertisementClick = (websiteLink) => {
    const formattedLink = websiteLink.startsWith('http')
      ? websiteLink
      : `http://${websiteLink}`;
    window.open(formattedLink, '_blank');
  };

  const handleArticleClick = async (articleId) => {
    try {
      await axios.put(`${API_URL}/api/articles/increment-views/${articleId}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const convertToNepaliNumber = (num) => {
    const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num
      .toString()
      .split('')
      .map((digit) => nepaliNumbers[parseInt(digit)] || digit)
      .join('');
  };

  useEffect(() => {
    fetchArticles(pagination.currentPage);
    fetchAuthor();
    fetchAdvertisements();
  }, [id, pagination.currentPage]);

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAdvertisements = (position) => {
    const ads = advertisements[position];
    if (!ads || ads.length === 0) return null;

    return (
      <div className="flex flex-row justify-center items-center my-8">
        {ads.map((ad) => (
          <div
            key={ad._id}
            className="mx-2 cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => handleAdvertisementClick(ad.websiteLink)}
          >
            <img
              src={`${API_URL}/${ad.imagePath}`}
              alt="Advertisement"
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavbarTop />
      <Heading />
      <BottomHeader />

      {renderAdvertisements('nepali_top')}
      
      {/* Enhanced Author Header Section */}
<div className="relative text-white py-12 mb-8" style={{background: '#25609A'}}>            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8">
                {authorInfo.photo && (
                  <div className="mb-4 md:mb-0">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden">
                      <img
                        src={`${API_URL}/uploads/authors/${authorInfo.photo}`}
                        alt="Author"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {`${authorInfo.firstName || ''} ${authorInfo.lastName || ''}`}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {articles.length} {articles.length === 1 ? 'Article' : 'Articles'} Published
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error.articles && (
            <div className="container mx-auto px-4 text-red-600 text-center py-8 bg-red-50 rounded-lg mb-8">
              <p className="text-lg">{error.articles}</p>
            </div>
          )}

          {/* Articles Grid with Enhanced Cards */}
          <div className="container mx-auto px-4 mb-12">
            {loading ? (
              <SkeletonLoader />
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div 
                  key={article._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link href={`/article/${article._id}`} legacyBehavior>
                    <a
                      className="block cursor-pointer h-full flex flex-col"
                      onClick={() => handleArticleClick(article._id)}
                    >
                      {article.photos && article.photos.length > 0 && (
                        <div className="relative overflow-hidden h-48">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"></div>
                          <img
                            src={`${API_URL}/uploads/articles/${article.photos[0].split('/').pop()}`}
                            alt={article.headline}
                            className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 transition-colors duration-300" style={{color: 'inherit'}} onMouseEnter={(e) => e.target.style.color = '#25609A'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>
                          {article.headline}
                        </h3>
                        {article.subheadline && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {article.subheadline}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <span className="flex items-center mr-3">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(article.createdAt).toLocaleDateString('ne-NP')}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {article.views || 0}
                          </span>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Enhanced Pagination Design */}
          {pagination.totalPages > 1 && (
            <div className="container mx-auto px-4 mb-12">
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    pagination.currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-white hover:text-white shadow-sm'
                  }`}
                  style={pagination.currentPage === 1 ? {} : {backgroundColor: '#25609A'}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {generatePageNumbers().map((pageNumber, index) => (
                  <span key={index}>
                    {index > 0 && generatePageNumbers()[index - 1] !== pageNumber - 1 && (
                      <span className="text-gray-400 px-2">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 rounded-lg transition-all duration-300 font-bold shadow-sm ${
                        pagination.currentPage === pageNumber
                          ? 'text-white shadow-md transform scale-110'
                          : 'bg-white text-gray-700 hover:bg-opacity-80 shadow-sm'
                      }`}
                      style={pagination.currentPage === pageNumber ? {backgroundColor: '#25609A'} : {backgroundColor: '#ffffff'}}
                    >
                      {pageNumber}
                    </button>
                  </span>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    pagination.currentPage === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-white hover:text-white shadow-sm'
                  }`}
                  style={pagination.currentPage === pagination.totalPages ? {} : {backgroundColor: '#25609A'}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

      {renderAdvertisements('nepali_belowauthor')}
      
      <footer className="mt-12">
        <FooterBottom />
        <LowerHeading />
      </footer>
    </div>
  );
};

export default AuthorPage;