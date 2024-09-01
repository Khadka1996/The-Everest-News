"use client";
import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FiChevronDown } from 'react-icons/fi';

const Videos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch videos from your backend API
    fetch('https://api.theeverestnews.com/api/videos')
      .then((response) => response.json())
      .then((data) => {
        // Sort videos by date in descending order
        const sortedVideos = data.videos.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Get the latest 6 videos
        const latestVideos = sortedVideos.slice(0, 6);
        setVideos(latestVideos);
      })
      .catch((error) => console.error('Error fetching videos:', error));
  }, []);

  // Helper function to extract YouTube video ID from the URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match && match[1];
  };

  return (
    <div className="video-gallery p-6 bg-gray-100 rounded-xl shadow-lg">
<h1 className="text-2xl font-extrabold text-white bg-[#25609A] py-4 px-8 rounded-t-lg shadow-lg cursor-pointer hover:bg-[#7BB660] transition-all duration-300 ease-in-out flex justify-center items-center text-center">
  भिडियो ग्यालरी
</h1>
      <div className="video-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video._id} className="video-card bg-white rounded-lg shadow-md overflow-hidden">
            {video.videoType === 'local' ? (
              <video className="video w-full h-40 object-cover" controls>
                <source src={`https://api.theeverestnews.com/${video.videoFile}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <YouTube videoId={getYouTubeVideoId(video.youtubeLink)} className="youtube-video w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <p className="video-title text-lg font-semibold text-center">{video.title}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="/videos" className="more-down-link flex items-center justify-center mt-6 text-blue-500 hover:text-blue-700 transition">
        <span className="more-down-text text-lg font-semibold">थप भिडियो </span>
        <FiChevronDown className="more-down-icon ml-2" />
      </a>
    </div>
  );
};

export default Videos;