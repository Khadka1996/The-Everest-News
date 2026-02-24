"use client"
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFire, FaClock } from 'react-icons/fa';
import Trending from '../Header/TrendingArticles';
import Latest from '../Header/LatestNews';
import Search from '../Header/Search';

const LowerHeading = ({ trendingNews, latestNews }) => {
  const [activePopup, setActivePopup] = useState(null);

  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  const closeAllPopups = () => {
    setActivePopup(null);
  };

  return (
    <div className="md:hidden">
      {/* Mobile Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-2 border-t border-gray-200 z-50 shadow-lg">
        <div className="flex items-center justify-around text-center text-gray-700">
          <button 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => togglePopup('trending')}
            aria-label="Trending articles"
          >
            <FaFire className={`text-2xl mb-1 ${activePopup === 'trending' ? 'text-[#25609A]' : 'text-gray-500'}`} />
            <span className="text-xs">Trending</span>
          </button>
          
          <button 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => togglePopup('latest')}
            aria-label="Latest news"
          >
            <FaClock className={`text-2xl mb-1 ${activePopup === 'latest' ? 'text-[#25609A]' : 'text-gray-500'}`} />
            <span className="text-xs">Latest</span>
          </button>
          
          <button 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => togglePopup('search')}
            aria-label="Search articles"
          >
            <FaSearch className={`text-2xl mb-1 ${activePopup === 'search' ? 'text-[#25609A]' : 'text-gray-500'}`} />
            <span className="text-xs">Search</span>
          </button>
        </div>
      </div>

      {/* Popup Overlays */}
      {activePopup === 'trending' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pt-16 pb-20">
          <Trending onClose={closeAllPopups} trendingNews={trendingNews} />
        </div>
      )}
      
      {activePopup === 'latest' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pt-16 pb-20">
          <Latest onClose={closeAllPopups} latestNews={latestNews} />
        </div>
      )}
      
      {activePopup === 'search' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pt-16 pb-20 px-4">
          <Search onClose={closeAllPopups} />
        </div>
      )}
    </div>
  );
};

LowerHeading.propTypes = {
  trendingNews: PropTypes.array,
  latestNews: PropTypes.array,
};

export default LowerHeading;