"use client";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { FaClock, FaFacebook, FaWhatsapp, FaShareAlt, FaInstagram, FaAd } from 'react-icons/fa';
import NepaliDate from 'nepali-date';
import { BsTwitterX } from "react-icons/bs"; 
import YouTube from 'react-youtube';
import { useParams } from "next/navigation";
import axios from "axios";
import API_URL from "@/app/config";

// ✅ OPTIMIZED: Lazy load ReadMore component (below-fold content)
const ReadMore = lazy(() => import("@/app/Pages/ReadMore"));

// Loading Skeleton Component
const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Main Content Skeleton */}
      <div className="md:mx-10 lg:w-3/4">
        <div className="my-2 space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded-full mr-1 animate-pulse"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          <hr className="my-4" />
          
          <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse"></div>
          
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-16 h-6 bg-gray-200 rounded-full mr-2 mt-2 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-1/4 flex-shrink-0">
        <div className="bg-white p-4 rounded-lg shadow-lg sticky top-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mb-4"></div>
          <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

const ArticlePage = () => {
  const { id } = useParams();
  
  const [article, setArticle] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ OPTIMIZED: Single API call - article includes authors & tags
        const articleResponse = await axios.get(`${API_URL}/api/articles/${id}`);

        const articleData = articleResponse.data.data || null;
        
        // ✅ Extract tags from article response
        const tagsArray = articleData?.selectedTags || [];

        setArticle(articleData);
        setTags(tagsArray);

        // ℹ️ Fetch full author objects (backend transforms to strings, need full objects for photo)
        try {
          const authorsResponse = await axios.get(`${API_URL}/api/articles/${id}/authors`);
          const authorsArray = authorsResponse.data.data || [];
          setAuthors(authorsArray);
        } catch (authError) {
          console.warn("Could not fetch author details:", authError.message);
          setAuthors([]); // Fallback to empty
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching article data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFacebookShare = async () => {
    try {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, '_blank');
      updateShareCount('facebook');
    } catch (error) {
      console.error('Error sharing on Facebook:', error);
    }
  };
  
  const handleTwitterShare = async () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article?.headline || '')}`;
    window.open(shareUrl, '_blank');
    updateShareCount('twitter');
  };
  
  const handleWhatsappShare = async () => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${article?.headline || ''} - ${window.location.href}`)}`;
    window.open(shareUrl, '_blank');
    updateShareCount('whatsapp');
  };
  
  const updateShareCount = async (platform) => {
    try {
      await axios.post(`${API_URL}/api/articles/update-share-count/${id}/share`, { platform });
    } catch (error) {
      console.error(`Error updating share count for ${platform}:`, error);
    }
  }

  const handleInstagramShare = async () => {
    const shareUrl = `https://www.instagram.com/direct/new/?text=${encodeURIComponent(`${article?.headline || ''} - ${window.location.href}`)}`;
    window.open(shareUrl, '_blank');
    updateShareCount('instagram');
  };
// ✅ OPTIMIZED: Move Advertisement Component outside main component
// and memoize to prevent unnecessary re-renders
const AdvertisementComponent = React.memo(({ position }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [adLoading, setAdLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setAdLoading(true);
        const response = await axios.get(`${API_URL}/api/advertisements/${position}`);
        setAdvertisements(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(`Error fetching ${position} advertisements:`, error);
        setAdvertisements([]);
      } finally {
        setAdLoading(false);
      }
    };

    fetchAdvertisements();
  }, [position]);

  const handleAdvertisementClick = (websiteLink) => {
    const trimmedLink = websiteLink.trim();
    window.open(trimmedLink.match(/^https?:\/\//i) ? trimmedLink : `http://${trimmedLink}`, '_blank');
  };

  if (adLoading) {
    return (
      <div className='flex flex-col p-4 items-center space-y-4'>
        <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col p-4 items-center space-y-4'>
      {advertisements.map((advertisement) => (
        <div key={advertisement._id} onClick={() => handleAdvertisementClick(advertisement.websiteLink)}>
          <img className='rounded' src={`${API_URL}/${advertisement.imagePath}`} alt="Advertisement" />
        </div>
      ))}
    </div>
  );
});

AdvertisementComponent.displayName = 'AdvertisementComponent';

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*(?:\/|v=)|[^\/]*\/))([^"&?\/\s]{11})/);
    return match && match[1];
  };

  const formatNepaliDate = (timestamp) => {
    const nepaliDate = new NepaliDate(new Date(timestamp));
    const nepaliMonths = ['वैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
    const toNepaliNumber = (number) => number.toString().split('').map(digit => ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'][parseInt(digit, 10)]).join('');

    return `${toNepaliNumber(nepaliDate.getDate())} ${nepaliMonths[nepaliDate.getMonth()]} ${toNepaliNumber(nepaliDate.getYear())} (${nepaliDate.format('ddd')})`;
  };

  const imageUri = article && article.photos && article.photos.length > 0 ? `${API_URL}/uploads/articles/${article.photos[0].split('/').pop()}` : '';

  return (
    <>
      <div className="mt-2">
        <AdvertisementComponent position="nepali_top" />
      </div>
      
      {loading ? (
        <LoadingSkeleton />
      ) : article ? (
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="mx-3 md:mx-10 lg:mx-20">
          <div className="my-2">
    <h1 className="text-3xl font-bold">{article.headline}</h1>
<h4 className="text-lg mb-4">{article.subheadline}</h4>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 px-4 py-3 bg-gray-50 rounded-lg">
           
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 lg:gap-5">
  {/* Authors */}
  {authors.map((author) => (
    <a 
      key={author._id} 
      href={`/author/${author._id}`} 
      className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
    >
      <img 
        src={`${API_URL}/uploads/authors/${author.photo}`} 
        alt={`${author.firstName} ${author.lastName}`} 
        className="w-8 h-8 rounded-full object-cover border border-gray-200"
        loading="lazy"
      />
      <span className="text-sm font-medium text-gray-700">
        {`${author.firstName} ${author.lastName}`}
      </span>
    </a>
  ))}
  
  {/* Date */}
  <div className="flex items-center text-gray-500 text-sm">
    <FaClock className="mr-1.5" />
    <span>
      {article.publishDate ? formatNepaliDate(new Date(article.publishDate)) : "No Date"}
    </span>
  </div>

  {/* Divider - only visible on larger screens */}
  <div className="hidden md:block h-5 w-px bg-gray-300 mx-1"></div>

  {/* Share Count */}
  <div className="flex items-center px-3 py-2 text-gray-600">
    <FaShareAlt className="mr-2 text-gray-900" />
    <span className="text-m font-bold">{article.shareCount} Shares</span>
  </div>
  
  {/* Social Buttons */}
  <div className="flex items-center gap-1 sm:gap-2">
    <button 
      onClick={handleFacebookShare} 
      className="group relative p-2 sm:p-2.5 rounded-full transition-all duration-300
                text-blue-600 hover:text-white hover:bg-blue-600
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="Share on Facebook"
    >
      <FaFacebook size={18} className="sm:size-5" />
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 
                    group-hover:opacity-100 transition-opacity duration-200 text-gray-600">
        Facebook
      </span>
    </button>
    
    <button 
      onClick={handleTwitterShare} 
      className="group relative p-2 sm:p-2.5 rounded-full transition-all duration-300
                text-gray-800 hover:text-white hover:bg-gray-800
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      aria-label="Share on Twitter"
    >
      <BsTwitterX size={16} className="sm:size-[17px]" />
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 
                    group-hover:opacity-100 transition-opacity duration-200 text-gray-600">
        Twitter
      </span>
    </button>
    
    <button 
      onClick={handleWhatsappShare} 
      className="group relative p-2 sm:p-2.5 rounded-full transition-all duration-300
                text-green-500 hover:text-white hover:bg-green-500
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      aria-label="Share on WhatsApp"
    >
      <FaWhatsapp size={18} className="sm:size-5" />
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 
                    group-hover:opacity-100 transition-opacity duration-200 text-gray-600">
        WhatsApp
      </span>
    </button>
    
    <button 
      onClick={handleInstagramShare} 
      className="group relative p-2 sm:p-2.5 rounded-full transition-all duration-300
                text-pink-600 hover:text-white hover:bg-gradient-to-r from-pink-600 to-purple-600
                focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
      aria-label="Share on Instagram"
    >
      <FaInstagram size={18} className="sm:size-5" />
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 
                    group-hover:opacity-100 transition-opacity duration-200 text-gray-600">
        Instagram
      </span>
    </button>
  </div>
</div>

</div>
              <hr className="my-4" />
              <img
                className="w-full md:w-5/5 lg:w-6/6 xl:w-5/5 mx-auto mb-4"
                src={imageUri}
                alt={article.headline}
              />

              <div className="text-gray-800 my-4 font-medium text-xl " dangerouslySetInnerHTML={{ __html: article.content }} />
              {article.youtubeLink && (
                <div className="mt-6">
                  <YouTube videoId={getYouTubeVideoId(article.youtubeLink)} className="w-full md:w-3/4 lg:w-1/2 mx-auto" />
                </div>
              )}
              {tags && (
                <div className="flex flex-wrap justify-center mt-4">
                  {tags.map((tag) => (
                    <a
                      key={tag._id}
                      href={`/tag/${tag._id}`}
                      className="bg-gradient-to-r from-[#25609A] to-[#749ec9] text-white text-sm rounded-md py-1 px-3 mr-2 mt-2"
                    >
                      #{tag.name}
                    </a>
                  ))}
                </div>
              )}

              <AdvertisementComponent position="nepali_bottom" />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex-shrink-0 space-y-6">
            <div className="bg-white p-1 rounded-lg shadow-lg sticky top-6">
              <h3 className="font-bold text-lg mb-4 pb-1 border-b border-gray-200 flex items-center">
                <FaAd className="text-[#25609A] mr-2" />
              </h3>
              <AdvertisementComponent position="nepali_sidebar2" />
            </div>
          </div>
        </div>
      ) : (
        <p>Error: {error?.message || 'Article not found.'}</p>
      )}
      
      {/* ✅ OPTIMIZED: Lazy load ReadMore component with Suspense */}
      {article && (
        <Suspense fallback={<div className="py-8 px-4 text-center text-gray-500">Loading more articles...</div>}>
          <ReadMore 
            currentArticleId={article._id} 
            currentCategory={article.category?.name}
            currentTags={article.selectedTags}
          />
        </Suspense>
      )}
    </>
  );
};

export default ArticlePage;