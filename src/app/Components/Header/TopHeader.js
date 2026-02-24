"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MdLocationOn, MdOutlineLanguage } from "react-icons/md";
import { WiDayCloudy } from "react-icons/wi";
import { BiCalendar } from "react-icons/bi";
import { RxCaretDown } from "react-icons/rx";
import { RiFacebookFill, RiInstagramFill, RiTiktokFill, RiTwitterXFill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";

const NavbarTop = () => {
  const [temperature, setTemperature] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const convertToNepaliNumber = (number) => {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(number).replace(/\d/g, (digit) => nepaliDigits[digit]);
  };

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Kathmandu&appid=d7818a98cdb40947fce56490f73b49fa&units=metric');
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const weatherData = await response.json();
      const temperature = weatherData?.main?.temp;
      if (temperature !== undefined) {
        const nepaliTemperature = convertToNepaliNumber(temperature);
        setTemperature(nepaliTemperature);
      } else {
        throw new Error('Invalid weather data format');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className='bg-[#25609A] text-white py-3 relative '>
      <div className='flex flex-row justify-between items-center md:max-10 lg:mx-20'>
        <div className='flex flex-row flex-nowrap justify-start items-center md:gap-3 lg:gap-6'>
          <div className='hidden md:flex md:flex-row md:justify-center md:gap-1'>
            <MdLocationOn />
            <span>काठमाडौं</span>
          </div>
          <div className='flex flex-row justify-center items-center gap-1'>
            <WiDayCloudy />
            <span>{temperature !== null ? `${temperature}°C` : 'Loading...'}</span>
          </div>
          <div className='flex flex-row flex-nowrap justify-center items-start md:items-center text-sm md:font-normal md:gap-1'>
            <BiCalendar />
            <span>{currentDate}</span>
          </div>
        </div>
        <div className='flex flex-row justify-end items-center md:gap-4 lg:gap-8'>
          <div className='relative' ref={dropdownRef}>
            <button 
              className='flex flex-row md:gap-2 lg:gap-3 justify-center items-center focus:outline-none'
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              aria-expanded={isLanguageDropdownOpen}
              aria-haspopup="true"
            >
              <MdOutlineLanguage />
              <span>English</span>
              <RxCaretDown className={`transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div 
              className={`absolute top-full right-0 bg-[#25609A] flex flex-col p-3 rounded-sm shadow-lg min-w-[120px] z-[9999] transition-all duration-200 ${isLanguageDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
            >
              <a 
                className='mb-2 hover:underline whitespace-nowrap' 
                href="https://english.theeverestnews.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsLanguageDropdownOpen(false)}
              >
                English
              </a>
              <a 
                className='hover:underline whitespace-nowrap'
                href="https://theeverestnews.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsLanguageDropdownOpen(false)}
              >
                Nepali
              </a>
            </div>
          </div>
          <div className='hidden md:flex md:flex-row md:justify-center md:items-center md:gap-2 lg:gap-3'>
            <a href="https://www.facebook.com/profile.php?id=61557594452068" target="_blank" rel="noopener noreferrer" className="icon-link-1">
              <RiFacebookFill style={{ fontSize: "18px" }} />
            </a>
            <a href="https://twitter.com/TheEverestNews" target="_blank" rel="noopener noreferrer" className="icon-link-2">
              <RiTwitterXFill style={{ fontSize: "18px" }} />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="icon-link-3">
              <RiTiktokFill style={{ fontSize: "18px" }} />
            </a>
            <a href="https://www.instagram.com/everestportal/?=NXZ3YmRINnhwNWN3" target="_blank" rel="noopener noreferrer" className="icon-link-4">
              <RiInstagramFill style={{ fontSize: "21px" }} />
            </a>
            <a href="https://www.youtube.com/channel/UC6bTt6eddfNfh6q1m0QxG1A" target="_blank" rel="noopener noreferrer" className="icon-link-5">
              <FaYoutube style={{ fontSize: "21px" }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarTop;