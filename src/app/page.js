"use client";
import React, { useState, useEffect } from "react";
import LowerHeading from "./Components/Footer/LowerHeading";
import BottomHeader from "./Components/Header/BottomHeader";
import MiddleHeader from "./Components/Header/MiddleHeader";
import TopHeader from "./Components/Header/TopHeader";
import Video from "./ImageVideo/Video";
import FooterBottom from "./Components/Footer/FooterBottom";
import TrendingArticles from "./Pages/ArticlePage";
import axios from "axios";
import API_URL from "./config";

const AdvertisementPopup = ({ position, onClose }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [timer, setTimer] = useState(5); // 5 seconds timer

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/advertisements/${position}`);
        setAdvertisements(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(`Error fetching ${position} advertisements:`, error);
        setAdvertisements([]);
        onClose(); // Close if error occurs
      }
    };

    fetchAdvertisements();
  }, [position, onClose]);

  useEffect(() => {
    if (advertisements.length > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [advertisements, onClose]);

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

  if (advertisements.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#25609A] bg-opacity-90 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full p-4">
        {advertisements.map((ad) => (
          <div key={ad._id} className="cursor-pointer" onClick={() => handleAdvertisementClick(ad.websiteLink)}>
            <img
              src={`${API_URL}/${ad.imagePath}`}
              alt="Advertisement"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        ))}
        <div className="flex justify-between items-center mt-4 text-white">
          <span>Advertisement</span>
          <button 
            onClick={onClose}
            className="bg-white text-[#25609A] px-4 py-2 rounded hover:bg-gray-200"
          >
            Skip Ad ({timer}s)
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showFooterBottom, setShowFooterBottom] = useState(false);
  const [showLowerHeading, setShowLowerHeading] = useState(false);
  const [showPreloadAd, setShowPreloadAd] = useState(true);
  const [hasPreloadAd, setHasPreloadAd] = useState(false);

  useEffect(() => {
    // Check if preload ad exists
    const checkPreloadAd = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/advertisements/`);
        if (response.data.advertisements && response.data.advertisements.length > 0) {
          setHasPreloadAd(true);
        } else {
          setShowPreloadAd(false);
        }
      } catch (error) {
        console.error('Error checking preload ad:', error);
        setShowPreloadAd(false);
      }
    };

    checkPreloadAd();
  }, []);

  useEffect(() => {
    const loadMainContent = () => {
      const videoTimeout = setTimeout(() => setShowVideo(true), 2000);
      const footerTimeout = setTimeout(() => setShowFooterBottom(true), 3000);
      const headingTimeout = setTimeout(() => setShowLowerHeading(true), 3000);
      const loadingTimeout = setTimeout(() => setIsLoading(false), 3500);

      return () => {
        clearTimeout(videoTimeout);
        clearTimeout(footerTimeout);
        clearTimeout(headingTimeout);
        clearTimeout(loadingTimeout);
      };
    };

    if (!showPreloadAd) {
      loadMainContent();
    }
  }, [showPreloadAd]);

  return (
    <main>
      {/* Preload Advertisement Popup */}
      {showPreloadAd && hasPreloadAd && (
        <AdvertisementPopup 
          position="nepali_popup"
          onClose={() => setShowPreloadAd(false)}
        />
      )}

      {/* Main Content */}
      {!showPreloadAd && (
        <>
          {/* Header Section */}
          <TopHeader />
          <MiddleHeader />
          <BottomHeader />

          {/* Main Content */}
          <TrendingArticles />


          {/* Delayed Content */}
          <section aria-live="polite">
            {isLoading ? (
              <div className="loading-placeholder">
                {/* Add skeleton loading or spinner */}
              </div>
            ) : (
              <>
                {showVideo && <Video />}
                {showFooterBottom && <FooterBottom />}
                {showLowerHeading && <LowerHeading />}
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
}

// Your original AdvertisementComponent
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