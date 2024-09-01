'use client';

import { useEffect, useState } from 'react';
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
          <img className="rounded" src={`https://api.theeverestnews.com/${advertisement.imagePath}`} alt="Advertisement" />
        </div>
      ))}
    </div>
  );
};

const OurTeam = () => {
  // Inline style for rolling text animation
  const rollingTextStyle = {
    animation: 'rolling 2s ease-in-out infinite alternate',
  };

  // Inline style for pyramid shape
  const pyramidStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  };

  const triangleStyle = {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '0 30px 50px 30px',
    borderColor: 'transparent transparent #4A5568 transparent',
  };

  const middleTriangleStyle = {
    ...triangleStyle,
    borderWidth: '0 40px 70px 40px',
    borderColor: 'transparent transparent #2D3748 transparent',
  };

  const topTriangleStyle = {
    ...triangleStyle,
    borderWidth: '0 50px 90px 50px',
    borderColor: 'transparent transparent #1A202C transparent',
  };

  return (
    <div>
      <NavbarTop />
      <Heading />
      <BottomHeader />

      {/* Our Team Section with Rolling Text */}
      <div className="my-10 flex justify-center">
        <div className="relative">
          <div className="overflow-hidden h-10">
            <div style={rollingTextStyle} className="text-4xl font-bold text-green-600">
              The Everest News Team
            </div>
          </div>
        </div>
      </div>

      {/* Pyramid Shape */}
      <div style={pyramidStyle}>
        <div style={topTriangleStyle} />
        <div style={middleTriangleStyle} />
        <div style={triangleStyle} />
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

// Inline CSS for rolling animation
const globalStyles = `
@keyframes rolling {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
`;

// Create a style tag and append it to the head of the document
const styleTag = document.createElement('style');
styleTag.textContent = globalStyles;
document.head.appendChild(styleTag);
