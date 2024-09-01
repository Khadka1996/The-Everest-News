'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import NavbarTop from '@/app/Components/Header/TopHeader';
import Heading from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import FooterBottom from '@/app/Components/Footer/FooterBottom';

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
                src={`https://api.theeverestnews.com/${advertisement.imagePath}`}
                alt="Advertisement"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const CategoryPage = ({ params }) => {
  const { categoryName } = params;
  const decodedCategoryName = decodeURIComponent(categoryName);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const articlesPerPage = 12;

  const handleArticleClick = async (id) => {
    console.log(`Article clicked: ${id}`);
    try {
      await axios.put(`https://api.theeverestnews.com/api/articles/increment-views/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  useEffect(() => {
    if (decodedCategoryName) {
      fetch(`https://api.theeverestnews.com/api/articles/category/${decodedCategoryName}`)
        .then(response => response.json())
        .then(data => setArticles(data.data))
        .catch(error => {
          console.error('Error fetching articles:', error);
          setError('Error fetching articles. Please try again later.');
        });
    }
  }, [decodedCategoryName]);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * articlesPerPage;
  const displayedArticles = articles.slice(startIndex, startIndex + articlesPerPage);

  const convertToNepaliNumber = (num) => {
    const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(digit => nepaliNumbers[parseInt(digit)]).join('');
  };

  return (
    
    <div className=''>
      <NavbarTop />
      <Heading />
      <BottomHeader />
      <AdvertisementComponent position="top" />
      <div className="mx-3 md:mx-10 lg:mx-20">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map(article => (
            <li key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={`/article/${article._id}`} legacyBehavior>
                <a className="block cursor-pointer" onClick={() => handleArticleClick(article._id)}>
                  {article.photos && article.photos.length > 0 && (
                    <img
                      src={`https://api.theeverestnews.com/uploads/articles/${article.photos[0].split('/').pop()}`}
                      alt={article.headline}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600">{article.headline}</h2>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="flex justify-center mt-6">
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <span
              key={pageNumber}
              className={`mx-2 cursor-pointer text-lg ${currentPage === pageNumber + 1 ? 'font-bold text-blue-600' : 'text-gray-600'}`}
              onClick={() => handlePageChange(pageNumber + 1)}
            >
              {convertToNepaliNumber(pageNumber + 1)}
            </span>
          ))}
        </div>
      </div>
      <AdvertisementComponent position="below_category" />
      <FooterBottom/>
    </div>
  );
};

export default CategoryPage;