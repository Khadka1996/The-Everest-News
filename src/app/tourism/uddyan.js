"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultPhoto from '../Components/assets/logo2.png';



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

const TourismArticle = () => {
  const [articles, setArticles] = useState([]); // State to hold articles
  const [error, setError] = useState(null);

  // Function to handle article click and increment views
  const handleArticleClick = async (id) => {
    try {
      // Increment article views by sending a PUT request
      await axios.put(`https://api.theeverestnews.com/api/articles/increment-views/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchTourismUddyans = async () => {
      try {
        // Fetch tourism articles
        const response = await axios.get('https://api.theeverestnews.com/api/articles/category/उड्डयन');
        const data = response.data.data.slice(0, 15); // Limit articles to 12
        setArticles(data); // Set fetched articles to state
      } catch (error) {
        console.error('Error fetching tourism articles:', error);
        setError('Error fetching tourism articles. Please try again later.');
      }
    };

    fetchTourismUddyans();
  }, []);

  return (
    <div className="mx-3 md:mx-10 lg:mx-20 mt-5">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      {articles.length > 0 && (
        <h1 className="text-3xl font-semibold mb-4 text-[#7BB660]">उड्डयन</h1>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {articles.map((article) => (
          <div key={article._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <a href={`/article/${article._id}`} className="block" onClick={() => handleArticleClick(article._id)}>
              <img
                src={article.photos && article.photos.length > 0 ? `https://api.theeverestnews.com/uploads/articles/${article.photos[0].split("/").pop()}` : defaultPhoto}
                alt={article.headline}
                className="w-full h-[150px] object-cover object-center hover:opacity-80 transition duration-300"
              />
              <div className="p-2">
                <h2 className="mb-2">{article.headline}</h2>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourismArticle;