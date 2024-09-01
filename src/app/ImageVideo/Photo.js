"use client";
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch photos with associated articles from your backend API
    fetch('https://api.theeverestnews.com/api/photos') // Update the API endpoint to fetch photos with associated articles
      .then((response) => response.json())
      .then((data) => {
        setPhotos(data.photos);
      })
      .catch((error) => console.error('Error fetching photos with associated articles:', error));

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Auto-slide after 4 seconds
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % (photos.length - 3)); // Slide to the next set of four photos
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + photos.length - 3) % (photos.length - 3)); // Slide to the previous set of four photos
  };

  return (
    <div className="photo-slider-article-first p-6 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="text-2xl font-extrabold text-white bg-[#25609A] py-4 px-8 rounded-t-lg shadow-lg cursor-pointer hover:bg-[#7BB660] transition-all duration-300 ease-in-out flex justify-center items-center text-center">
      फोटो ग्यालरी</h1>

      <div className="photo-container relative overflow-hidden">
        <div className="photo-slider flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * (220 + 20)}px)` }}>
          {photos.map((photo, index) => (
            <Link key={photo._id} to={`/photo`} className="photo-card w-56 flex-shrink-0 m-2 bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`https://api.theeverestnews.com/${photo.imagePath}`}
                alt={photo.description}
                className="w-full h-40 object-cover"
              />
              <p className="photo-description-article-first p-2 text-center">{photo.description}</p>
            </Link>
          ))}
        </div>
        {photos.length > 4 && (
          <>
            <button className="nav-button prev-button-photo-first absolute top-1/2 transform -translate-y-1/2 left-2 p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition">
              <FaChevronLeft />
            </button>
            <button className="nav-button next-button-photo-first absolute top-1/2 transform -translate-y-1/2 right-2 p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition">
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Photos;