'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

const toNepaliNumber = (number) => {
  const nepaliNumbers = ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०'];
  return number.toString().split('').map(digit => nepaliNumbers[parseInt(digit, 10) - 1]).join('');
};


const TrendingArticles = ({ onClose }) => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [error, setError] = useState(null);

  const handleArticleClick = async (id) => {
    try {
      await axios.put(`https://api.theeverestnews.com/api/articles/increment-views/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };
  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const response = await axios.get('https://api.theeverestnews.com/api/articles/trending');
        setLatestArticles(response.data.data);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
      }
    };

    fetchTrendingArticles();
  }, []);

  return (
    <div className='bg-[#ffffff] text-[#000000]'>
    <div className="md:max-10 lg:mx-20 pb-5 ">
        <div className='flex flex-col justify-center items-center '>
         <div className='flex flex-row justify-between items-center w-full pt-4 pb-2'>
      <div>
      <h2 className="font-bold text-xl">ट्रेन्डिङ लेखहरू</h2>
      </div>
      <div className="close-icon-latest-top" onClick={onClose}>
        <FaTimes style={{ fontSize: '28px' }} />
      </div>
        </div>   
      <hr className='border-t border-1 w-full border-[#333333]  mb-4' />
   
      {error && <p className="error-message-top">{error}</p>}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-center gap-2'>
  {latestArticles.slice(0, Math.min(9, latestArticles.length)).map((article, index) => (
    <div key={article._id} onClick={() => handleArticleClick(article._id)}>
      <a href={`/article/${article._id}`} target="_blank" >
        <div className='flex flex-row justify-between items-center gap-4'>
          <div className='flex  items-center'>
            <div>
              <span className="font-extrabold text-5xl text-[#878787]">{toNepaliNumber(index + 1)}</span>
            </div>
            <div className='ml-4'>
              <h3 className="font-semibold text-sm text-[#0a0a0a] text-end">{article.headline}</h3>
            </div>
          </div>
          <div className='flex justify-end items-end overflow-hidden h-20 w-40'>
            {article.photos && article.photos.length > 0 ? (
              <img
                src={`https://api.theeverestnews.com/uploads/articles/${article.photos[0].split('/').pop()}`}
                alt={`Photo 0`}
                className="rounded-lg h-full w-full object-cover"
              />
            ) : (
              <img src='./logo2.png' alt="Default Logo" className="default-logo-top" />
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

TrendingArticles.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default TrendingArticles;