'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '@/app/config';

const AdvertisementComponent = ({ position }) => {
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
                src={`${API_URL}/${advertisement.imagePath}`}
                alt="Advertisement"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const ads = () => {
  return (
    <div className=''>
      <AdvertisementComponent position="below_category" />
    </div>
  );
};

export default ads;