"use client";

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import Link from 'next/link';
import axios from 'axios';
import SideMenu from './SideMenu';
import Image from 'next/image';
import logo2 from './logo2.png';

const AdvertisementComponent = ({ position }) => {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`https://api.theeverestnews.com/api/advertisements/${position}`);
        setAdvertisements(response.data.advertisements);
        console.log(`Fetched ${position} advertisements:`, response.data.advertisements);
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
    <div className="grid grid-cols-1 gap-4">
      {advertisements.map((advertisement, index) => (
        <div
          key={index}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => handleAdvertisementClick(advertisement.websiteLink)}
        >
          <img src={`https://api.theeverestnews.com/${advertisement.imagePath}`} alt="Advertisement" className="w-full h-auto rounded-md" />
        </div>
      ))}
    </div>
  );
};

const Heading = ({ onSideMenuClick }) => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  const openSideMenuPopup = () => {
    setSideMenuVisible(true);
  };

  const closeSideMenuPopup = () => {
    setSideMenuVisible(false);
  };

  return (
    <div className="bg-white p-1 relative ">
      <div className="flex justify-center items-center md:max-10 lg:mx-20 ">
        <div className=" md:hidden">
          <Link href="/login">
            <FaRegCircleUser className="text-[#25609A] text-4xl" />
          </Link>
        </div>

        <div className="flex-1 ">
          <Link href="/" className="logo-link">
            <Image src={logo2} alt="Logo" className="h-16 md:h-24 w-auto" />
          </Link>
        </div>

        <div className="hidden md:flex ">
          <AdvertisementComponent position="Premium" />
        </div>

        <div className="md:hidden " onClick={openSideMenuPopup}>
          <AiOutlineMenuUnfold className="text-[#25609A] text-4xl" />
        </div>
      </div>

      {sideMenuVisible && <SideMenu onClose={closeSideMenuPopup} />}
    </div>
  );
};

Heading.propTypes = {
  onSideMenuClick: PropTypes.func.isRequired,
};

export default Heading;