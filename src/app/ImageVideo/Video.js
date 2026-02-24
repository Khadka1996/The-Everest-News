"use client";
import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FiChevronDown } from 'react-icons/fi';
import API_URL from '../config';

const Videos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/videos`)
      .then((response) => response.json())
      .then((data) => {
        const sortedVideos = data.videos.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestVideos = sortedVideos.slice(0, 6);
        setVideos(latestVideos);
      })
      .catch((error) => console.error('Error fetching videos:', error));
  }, []);

  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match && match[1];
  };

  return (
    <div className="video-gallery p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center">
          <span className="flex-none block px-6 py-3 text-2xl font-bold rounded-lg bg-gradient-to-r from-[#25609A] to-[#3377b2] text-white shadow-md">
            भिडियो ग्यालरी
          </span>
          <span className="flex-grow block border-t-2 border-[#3377b2] ml-4"></span>
        </h1>
      </div>

      {/* Video Grid - Fixed video display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div 
            key={video._id} 
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Fixed Video Container */}
            <div className="relative pt-[56.25%] bg-black"> {/* 16:9 Aspect Ratio */}
              {video.videoType === 'local' ? (
                <video 
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  controls
                >
                  <source src={`${API_URL}/${video.videoFile}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="absolute top-0 left-0 w-full h-full">
                  <YouTube 
                    videoId={getYouTubeVideoId(video.youtubeLink)} 
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        modestbranding: 1,
                        rel: 0
                      }
                    }}
                    className="w-full h-full"
                    containerClassName="w-full h-full"
                  />
                </div>
              )}
            </div>
            
            {/* Video Title (unchanged) */}
            <div className="p-4 bg-gradient-to-r from-[#25609A] to-[#3377b2]">
              <p className="text-lg font-semibold text-white text-center line-clamp-2">
                {video.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button (unchanged) */}
      <div className="mt-10 text-center">
        <a 
          href="/videos" 
          className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#25609A] to-[#3377b2] text-white font-medium hover:from-blue-700 hover:to-blue-500 transition-all shadow-md hover:shadow-lg"
        >
          <span className="mr-2">थप भिडियो हेर्नुहोस्</span>
          <FiChevronDown className="text-xl" />
        </a>
      </div>
    </div>
  );
};

export default Videos;