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
import Loader from "@/app/articless/loader"; // Import the Loader component

const AuthorPage = ({ params }) => {
  const { id } = params; // Author ID
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

  // Fetch articles by author and status with pagination
  const fetchArticles = async (page) => {
    setLoading(true);  // Start loading
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
      setLoading(false);  // End loading
    }
  };

  const generatePageNumbers = () => {
    const range = 2; // Number of pages to show before and after the current page
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
  
    let pageNumbers = [];
  
    // Show the first page
    if (currentPage - range > 1) {
      pageNumbers.push(1);
    }
  
    // Add the previous pages
    for (let i = currentPage - range; i < currentPage; i++) {
      if (i > 0) pageNumbers.push(i);
    }
  
    // Add the current page
    pageNumbers.push(currentPage);
  
    // Add the next pages
    for (let i = currentPage + 1; i <= currentPage + range; i++) {
      if (i <= totalPages) pageNumbers.push(i);
    }
  
    // Show the last page
    if (currentPage + range < totalPages) {
      pageNumbers.push(totalPages);
    }
  
    return pageNumbers;
  };

  const handlePageChange = (pageNumber) => {
    fetchArticles(pageNumber); // Fetch new page data
  };

  // Fetch author information
  const fetchAuthor = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/authors/${id}`);
      setAuthorInfo(res.data.author || {});
    } catch (error) {
      console.error('Error fetching author information:', error);
      setError((prev) => ({ ...prev, author: 'Error fetching author information. Please try again later.' }));
    }
  };

  // Fetch advertisements for specific positions
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
  }, [id, pagination.currentPage]);  // Re-fetch articles when page changes

  const renderAdvertisements = (position) => {
    const ads = advertisements[position];
    if (!ads || ads.length === 0) return null;

    return (
      <div className="flex flex-row justify-center items-center my-4">
        {ads.map((ad) => (
          <div
            key={ad._id}
            className="m-2 cursor-pointer"
            onClick={() => handleAdvertisementClick(ad.websiteLink)}
          >
            <img
              src={`${API_URL}/${ad.imagePath}`}
              alt="Advertisement"
              className="rounded w-full h-auto"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <NavbarTop />
      <Heading />
      <BottomHeader />

      {renderAdvertisements('nepali_top')}
      
      {loading ? (
        <Loader /> // Show loader while loading articles
      ) : (
        <>
          <div className="author-info flex items-center justify-center my-4">
            {authorInfo.photo && (
              <img
                src={`${API_URL}/uploads/authors/${authorInfo.photo}`}
                alt="Author"
                className="author-photo w-12 h-12 rounded-full mr-4"
              />
            )}
            <h1 className="text-lg font-medium">
              {`${authorInfo.firstName || ''} ${authorInfo.lastName || ''}`}
            </h1>
          </div>

          {error.articles && (
            <div className="text-red-600 text-center py-4">
              <p></p>
            </div>
          )}

          <div className="articles-list mx-3 md:mx-10 lg:mx-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {articles.map((article) => (
                <div key={article._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <Link href={`/article/${article._id}`} legacyBehavior>
                    <a
                      className="block cursor-pointer"
                      onClick={() => handleArticleClick(article._id)}
                    >
                      {article.photos && article.photos.length > 0 && (
                        <div className="article-photos mt-2">
                          {article.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={`${API_URL}/uploads/articles/${photo.split('/').pop()}`}
                              alt={`Photo ${index}`}
                              className="w-full h-48 object-cover"
                            />
                          ))}
                        </div>
                      )}
                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-800 hover:text-[#25609A]">
                          {article.headline}
                        </h2>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Design */}
          <div className="flex justify-center mt-6">
            {generatePageNumbers().map((pageNumber) => (
              <span
                key={pageNumber}
                className={`mx-2 cursor-pointer text-lg ${
                  pagination.currentPage === pageNumber ? 'font-bold' : ''
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                <span
                  className={`inline-block py-1 px-4 rounded-full ${pagination.currentPage === pageNumber
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-500 hover:bg-blue-100'
                    }`}
                >
                  {convertToNepaliNumber(pageNumber)}
                </span>
              </span>
            ))}
          </div>
        </>
      )}

      {renderAdvertisements('nepali_belowauthor')}
      <div className='mt-5'>
      <FooterBottom />
      <LowerHeading />
      </div>
    
    </div>
  );
};

export default AuthorPage;
