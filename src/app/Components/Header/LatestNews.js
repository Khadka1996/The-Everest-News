'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import API_URL from '@/app/config';

const toNepaliNumber = (number) => {
  const nepaliNumbers = ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०'];
  return number.toString().split('').map(digit => nepaliNumbers[parseInt(digit, 10) - 1]).join('');
};

const LatestNews = ({ onClose }) => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [error, setError] = useState(null);

  const handleArticleClick = async (id) => {
    try {
      await axios.put(`${API_URL}/api/articles/increment-views/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles/status/published`, {
          params: { limit: 9 }, // Fetch only 9 articles
        });
        setLatestArticles(response.data.data);
      } catch (error) {
        console.error('Error fetching latest articles:', error);
        setError('Error fetching latest articles. Please try again later.');
      }
    };

    fetchLatestArticles();
  }, []);

  return (
    <div className="bg-[#ffffff] text-[#333333] absolute top-0">
      <div className="md:max-10 lg:mx-20 pb-5">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row justify-between items-center w-full pt-4 pb-2">
            <div>
              <h2 className="font-bold text-xl">ताजा अपडेट</h2>
            </div>
            <div className="close-icon-latest-top" onClick={onClose}>
              <FaTimes style={{ fontSize: '28px' }} />
            </div>
          </div>
          <hr className="border-t border-1 w-full border-[#333333] mb-4" />

          {error && <p className="error-message-top">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-center gap-2">
            {latestArticles.map((article, index) => (
              <div key={article._id} onClick={() => handleArticleClick(article._id)}>
                <a href={`/article/${article._id}`} 
                 className="article-link-top">
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div>
                      <span className="font-extrabold text-5xl text-[#878787]">
                        {toNepaliNumber(index + 1)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-sm text-[#000000]">{article.headline}</h3>
                    </div>
                    <div className="flex justify-end items-end overflow-hidden h-20 w-40">
                      {article.photos && article.photos.length > 0 ? (
                        <img
                          src={`${API_URL}/uploads/articles/${article.photos[0].split('/').pop()}`}
                          alt="Article Thumbnail"
                          className="rounded-lg h-full w-full object-cover"
                        />
                      ) : (
                        <img src="./logo2.png" alt="Default Logo" className="default-logo-top" />
                      )}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

LatestNews.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LatestNews;
