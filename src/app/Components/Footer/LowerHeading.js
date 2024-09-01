"use client"
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFire, FaClock } from 'react-icons/fa';
import Trending from '../Header/TrendingArticles';
import Latest from '../Header/LatestNews';
import Search from '../Header/Search'; // Import the Search component

const LowerHeading = ({ trendingNews, latestNews }) => {
  const [trendingVisible, setTrendingVisible] = useState(false);
  const [latestVisible, setLatestVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [clientMessageVisible, setClientMessageVisible] = useState(false); // State for client message

  const openTrendingPopup = () => {
    setTrendingVisible(true);
    setLatestVisible(false);
    setSearchVisible(false);
    setClientMessageVisible(false); // Close client message if open
  };

  const openLatestPopup = () => {
    setLatestVisible(true);
    setTrendingVisible(false);
    setSearchVisible(false);
    setClientMessageVisible(false); // Close client message if open
  };

  const openSearch = () => {
    setSearchVisible(true);
    setTrendingVisible(false);
    setLatestVisible(false);
    setClientMessageVisible(false); // Close client message if open
  };

  const openClientMessage = () => {
    setClientMessageVisible(true);
    setTrendingVisible(false);
    setLatestVisible(false);
    setSearchVisible(false);
  };

  return (
    <div className="md:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-white p-2 border-t border-gray-200 z-50">
        <div className="flex items-center justify-around text-center text-gray-700">
          <div className="flex flex-col items-center cursor-pointer" onClick={openTrendingPopup}>
            <FaFire className="text-[#25609A] text-2xl mb-1" />
            <span className="text-xs">Trending</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={openLatestPopup}>
            <FaClock className="text-[#25609A] text-2xl mb-1" />
            <span className="text-xs">Latest</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={openSearch}>
            <FaSearch className="text-[#25609A] text-2xl mb-1" />
            <span className="text-xs">Search</span>
          </div>
        </div>
      </div>

      {trendingVisible && <Trending onClose={() => setTrendingVisible(false)} trendingNews={trendingNews} />}
      {latestVisible && <Latest onClose={() => setLatestVisible(false)} latestNews={latestNews} />}
      {searchVisible && <Search onClose={() => setSearchVisible(false)} />}
      {clientMessageVisible && (
        <div className="bg-blue-500 text-white p-4 fixed bottom-0 left-0 right-0 text-center">
          Use client
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