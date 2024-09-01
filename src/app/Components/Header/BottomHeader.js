
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { MdOutlineUpdate } from "react-icons/md";
import { RiMenuFold2Fill } from "react-icons/ri";

import Logo from '../assets/logo.png';


// import Trending from './Trending';
import SideMenu from './SideMenu'; 
import LatestNews from './LatestNews';
import TrendingArticles from './TrendingArticles';

const BottomHeader = () => {
  const [dropdown1Visible, setDropdown1Visible] = useState(false);
  const [dropdown2Visible, setDropdown2Visible] = useState(false);
  const [trendingVisible, setTrendingVisible] = useState(false);
  const [latestVisible, setLatestVisible] = useState(false);
  const [sideMenuVisible, setSideMenuVisible] = useState(false); // Add state for SideMenu
  const [scrolled, setScrolled] = useState(false); // Track scroll position

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openTrendingPopup = () => {
    setTrendingVisible(true);
  };

  const closeTrendingPopup = () => {
    setTrendingVisible(false);
  };

  const openLatestPopup = () => {
    setLatestVisible(true);
  };

  const closeLatestPopup = () => {
    setLatestVisible(false);
  };

  const openSideMenu = () => {
    setSideMenuVisible(true);
  };

  const closeSideMenu = () => {
    setSideMenuVisible(false);
  };

  


  return (
    <div className={`sticky top-0 z-50 ${scrolled ? '' : ''}`}>
    {/* Conditionally render the logo based on the state variable */}
    

    <nav className=" bg-[#25609A] text-white ">
      <div className="md:max-10 lg:mx-20 hidden lg:flex lg:flex-row lg:justify-between lg:items-center py-4 font-semibold text-lg ">
        <ul className="flex flex-row justify-center items-center gap-5  ">
          <li className="nav-item-Home ">
          {scrolled ? (
              <div className="w-10 h-10 overflow-hidden rounded transition duration-300 transform hover:scale-110">
                 <Link href="/">
                  <Image src={Logo} alt="Logo" width={40} height={40} layout="fixed" />
                </Link>             
               </div>
            ) : (
              <></>
            )}
            
            </li>
            <a class="text-xl font-semibold text-[#52aed3] hover:text-[#7BB761] hover:underline transition-all duration-300 ease-in-out transform hover:scale-105 custom-font" href="/">होमपेज</a>           
             <a className='hover:text-[#7BB761] hover:underline' href="/articles">समाचार</a>
          
          <li
  className="relative"
  onMouseEnter={() => setDropdown1Visible(true)}
  onMouseLeave={() => setDropdown1Visible(false)}
>
  <a
    href="/tourism"
    className={`cursor-pointer pb-4 hover:text-[#7BB761] hover:underline ${dropdown1Visible ? 'active' : ''}`}
  >
    पर्यटन
  </a>
  <div className='absolute top-10 bg-[#25609A] text-white px-4 shadow-sm shadow-black '>
    {dropdown1Visible && (
      <ul className="flex flex-col justify-start items-start gap-2" onMouseLeave={() => setDropdown1Visible(false)}>
        <li><a className='hover:text-[#7BB761] hover:underline' href="/category/उड्डयन">उड्डयन</a></li>
        <li><a className='hover:text-[#7BB761] hover:underline' href="/category/घुमफिर">घुमफिर</a></li>
        <li><a className='hover:text-[#7BB761] hover:underline' href="/category/हस्पिटालिटी">हस्पिटालिटी</a></li>
      </ul>
    )}
  </div>
</li>

          <li className="nav-item">
            <a className='hover:text-[#7BB761] hover:underline' href="/category/अर्थतन्त्र">अर्थतन्त्र</a>
          </li>
          <li className="nav-item">
            <a className='hover:text-[#7BB761] hover:underline' href="/category/राजनीति">राजनीति</a>
          </li>
         
          <li className="nav-item">
            <a className='hover:text-[#7BB761] hover:underline' href="/category/विचार">विचार</a>
          </li>
         
          <li className="nav-item">
            <a className='hover:text-[#7BB761] hover:underline' href="/category/मनोरञ्जन">मनोरञ्जन</a>
          </li>
          <li className="nav-item">
            <a className='hover:text-[#7BB761] hover:underline' href="/category/खेलकुद">खेलकुद</a>
          </li>
          <li
            className="relative"
            onMouseEnter={() => setDropdown2Visible(!dropdown2Visible)}
            onMouseLeave={() => setDropdown2Visible(false)}
          >
            <span className={`cursor-pointer pb-4 hover:text-[#7BB761] hover:underline  ${dropdown2Visible ? 'active' : ''}`}>थप समाचार</span>
            <div className='absolute top-18 bg-[#25609A] text-white px-4 shadow-sm shadow-black'>
            {dropdown2Visible && (
                <ul className="flex flex-col justify-start items-start gap-2 w-[140px]">
                <li><a className='hover:text-[#7BB761] hover:underline' href="/category/अन्तर्राष्ट्रिय">अन्तर्राष्ट्रिय</a></li>
                <li><a className='hover:text-[#7BB761] hover:underline' href="/category/फोटोग्यालरी">फोटो ग्यालरी </a></li>
                <li><a className='hover:text-[#7BB761] hover:underline' href="/videos">भिडियो ग्यालरी </a></li>
              </ul>
            )}
            </div>
          </li>
        </ul>
        {/* second nav like right nav */}



      


        <div className="flex flex-row justify-center items-center gap-3">
            <div>
        <button className="english-button">
      <a  className='bg-[#7BB761] py-2 px-4 rounded hover:bg-white hover:text-[#7BB761] duration-150 ease-in-out' href="http://english.theeverestnews.com">English</a>
        </button>
            </div>
          <div className="icon" onClick={openTrendingPopup}>
            <HiOutlineTrendingUp className='cursor-pointer hover:text-[#7BB761] ' style={{ fontSize: '28px' }} />
          </div>
          <div className="icon" onClick={openLatestPopup}>
            <MdOutlineUpdate className='cursor-pointer hover:text-[#7BB761] ' style={{ fontSize: '28px' }} />
          </div>
          <div className="icon" >
         
          <a className='cursor-pointer hover:text-[#7BB761] ' to="/login"><FaRegCircleUser className='cursor-pointer hover:text-[#7BB761] 'style={{ fontSize: '28px' }} /></a>
          </div>
          <div className="icon"  onClick={openSideMenu}>
            <RiMenuFold2Fill className='cursor-pointer hover:text-[#7BB761] ' style={{ fontSize: '28px' }} />
          </div>
        </div>
      </div>
    
    </nav>
   
    <div className={`absolute top-[-120px] md:top-[-155px] lg:top-[-160px] z-50 w-full`}>
    {trendingVisible && <TrendingArticles onClose={closeTrendingPopup} />}
    {latestVisible && <LatestNews onClose={closeLatestPopup} />}
     {sideMenuVisible && <SideMenu onClose={closeSideMenu} />}
    </div>
      </div>
  );
};

export default BottomHeader;