"use client";
import React, { useState, useEffect } from 'react';
import { MdLocationOn, MdOutlineLanguage } from "react-icons/md";
import { WiDayCloudy } from "react-icons/wi";
import { BiCalendar } from "react-icons/bi";
import { RxCaretDown } from "react-icons/rx";
import { RiFacebookFill, RiInstagramFill, RiTiktokFill, RiTwitterXFill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";

const NavbarTop = () => {
  const [dropDown, setDropDown] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

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

  const handleDropDown = () => {
    setDropDown(!dropDown);
  };

  const [toggle, setToggle] = useState(true);

  return (
    <div className='bg-[#25609A] text-white justify-between py-3'>
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
          <div className='relative'>
            <div className='flex flex-row md:gap-2 lg:gap-3 justify-center items-center'>
              <MdOutlineLanguage />
              <span className='cursor-pointer' onClick={() => setToggle(!toggle)}>English</span>
              <RxCaretDown />
            </div>
            <div className={`absolute top-8 bg-[#25609A] flex flex-col p-2 md:p-3 lg:p-4 rounded-sm z-50 ${toggle ? 'hidden' : ''}`} onMouseLeave={() => setToggle(!toggle)}>
              <a className='mb-2' href="https://english.theeverestnews.com/" target="_blank" rel="noopener noreferrer">English</a>
              <a href="https://theeverestnews.com/" target="_blank" rel="noopener noreferrer">Nepali</a>
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
