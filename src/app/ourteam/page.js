'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarTop from '@/app/Components/Header/TopHeader';
import Heading from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import API_URL from '../config';

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
      const formattedLink = trimmedLink.match(/^https?:\/\//i) ? trimmedLink : `http://${trimmedLink}`;
      window.open(formattedLink, '_blank');
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center">
      {advertisements.map((advertisement, index) => (
        <div key={index} className="advertisement cursor-pointer" onClick={() => handleAdvertisementClick(advertisement.websiteLink)}>
          <img className="rounded" src={`${API_URL}/${advertisement.imagePath}`} alt="Advertisement" />
        </div>
      ))}
    </div>
  );
};

const OurTeam = () => {
  return (
    <div>
      <NavbarTop />
      <Heading />
      <BottomHeader />

      {/* Our Team Section */}
      <div className="my-10 flex justify-center">
        <div className="relative">
          <div className="overflow-hidden h-10">
            <div className="text-4xl font-bold text-green-600">
              The Everest News Team
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 mt-2">
        <AdvertisementComponent position="middle" />
      </div>

      <div className="mb-6 mt-6">
        <AdvertisementComponent position="bottom" />
      </div>

      <FooterBottom />
    </div>
  );
};

export default OurTeam;
