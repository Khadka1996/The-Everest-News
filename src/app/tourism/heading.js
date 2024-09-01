"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import Link from 'next/link';
import SideMenu from '../Components/Header/SideMenu';
import Image from 'next/image';
import logo2 from './logo.png';
import './styles.css';

const TourismHeading = ({ onSideMenuClick }) => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  const openSideMenuPopup = () => {
    setSideMenuVisible(true);
  };

  const closeSideMenuPopup = () => {
    setSideMenuVisible(false);
  };

  return (
    <div className="bg-white p-1 relative header-container">
      <div className="flex justify-center items-center md:max-10 lg:mx-20">
        <div className="md:hidden">
          <Link href="/login">
            <FaRegCircleUser className="text-[#ffffff] text-4xl" />
          </Link>
        </div>

        <div className="flex-1 flex items-center">
          <Link href="/" className="logo-link flex items-center">
            <Image src={logo2} alt="Logo" className="h-16 md:h-24 w-auto rounded-3xl" />
           
          </Link>
         
          </div>
          <span className="flex-1 flex items-center text-3xl font-bold md:text-5xl text-[#ffffff]">पर्यटन</span>
        <div className="md:hidden" onClick={openSideMenuPopup}>
          <AiOutlineMenuUnfold className="text-[#ffffff] text-4xl" />
        </div>
      </div>

      {sideMenuVisible && <SideMenu onClose={closeSideMenuPopup} />}
    </div>
  );
};

TourismHeading.propTypes = {
  onSideMenuClick: PropTypes.func.isRequired,
};

export default TourismHeading;