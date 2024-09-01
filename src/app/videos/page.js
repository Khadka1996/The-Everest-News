'use client';

import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import axios from 'axios';
import NavbarTop from '../Components/Header/TopHeader';
import Heading from '../Components/Header/MiddleHeader';
import BottomHeader from '../Components/Header/BottomHeader';
import FooterBottom from '../Components/Footer/FooterBottom';
import LowerHeading from '../Components/Footer/LowerHeading';
import PhotoGallery from '../Home/PhotoGallery';
import TrendingArticles from '../Pages/TrendingPage';
import LatestUpdates from '../Pages/LatestPage';

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

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState(9); // State to track number of visible videos

  useEffect(() => {
    // Fetch videos from your backend API
    fetch('https://api.theeverestnews.com/api/videos')
      .then((response) => response.json())
      .then((data) => {
        // Sort videos by date in descending order
        const sortedVideos = data.videos.sort((a, b) => new Date(b.date) - new Date(a.date));
        setVideos(sortedVideos);
      })
      .catch((error) => console.error('Error fetching videos:', error));
  }, []);

  // Helper function to extract YouTube video ID from the URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match && match[1];
  };

  // Function to load more videos
  const loadMoreVideos = () => {
    setVisibleVideos((prevVisibleVideos) => prevVisibleVideos + 3);
  };

  return (
    <>
      <NavbarTop />
      <Heading />
      <BottomHeader />
      <AdvertisementComponent position="top" />

      <div className="mx-3 md:mx-10 lg:mx-20">
        <h1 className="gallery-title text-4xl text-[#7BB761] mt-8 font-bold mb-8">भिडियो ग्यालरी</h1>
        <div className="video-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, visibleVideos).map((video) => (
            <div key={video._id} className="video-card bg-white shadow-lg rounded-lg overflow-hidden">
              {video.videoType === 'local' ? (
                <video className="video w-full h-64" controls>
                  <source src={`https://api.theeverestnews.com/${video.videoFile}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  className="youtube-video w-full h-64"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.youtubeLink)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                ></iframe>
              )}
              <div className="text-video p-4">
                <p className="video-title-video text-lg font-semibold">{video.title}</p>
              </div>
            </div>
          ))}
        </div>

        {visibleVideos < videos.length && (
          <div className="flex items-center justify-center mt-8">
            <button
              onClick={loadMoreVideos}
              className="flex items-center text-lg text-blue-500 hover:text-blue-700"
            >
              थप भिडियो 
              <FiChevronDown className="ml-2 text-2xl" />
            </button>
          </div>
        )}
      </div>
      <AdvertisementComponent position="middle" />
      <PhotoGallery/>
      <AdvertisementComponent position="below_category" />
      <div className="flex flex-row flex-wrap lg:flex-nowrap">
        <TrendingArticles />
        <LatestUpdates />
      </div>
        <div className="mt-6">
        <AdvertisementComponent position="bottom" />
      </div>
      <FooterBottom />
      <LowerHeading />
    </>
  );
};

export default Videos;