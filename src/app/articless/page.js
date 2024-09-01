"use client";

import React, { useState, useEffect } from "react";
import { FaClock, FaFacebook, FaWhatsapp, FaFacebookMessenger, FaShareAlt } from 'react-icons/fa';
import { BsTwitterX } from "react-icons/bs"; 
import YouTube from 'react-youtube';
import { useParams } from "next/navigation";
import axios from "axios";
import ReadMore from "@/app/Pages/ReadMore";


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
        const [articleResponse, authorsResponse] = await Promise.all([
          axios.get(`https://api.theeverestnews.com/api/articles/${id}`),
          axios.get(`https://api.theeverestnews.com/api/articles/${id}/authors`),
        ]);

        const articleData = articleResponse.data.data || null;
        const authorsArray = authorsResponse.data.data || [];

        setArticle(articleData);
        setAuthors(authorsArray);
        setLoading(false);

        const tagsResponse = await axios.get(`https://api.theeverestnews.com/api/articles/${id}/tags`);
        const tagsArray = tagsResponse.data.data || [];

        setTags(tagsArray);
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
      fetchData
    } catch (error) {
      console.error('Error sharing on Facebook:', error);
    }
  };
  
  const handleFacebookMessengerShare = async () => {
    const shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=123456789`;
    window.open(shareUrl, '_blank');
    updateShareCount('messenger');
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
      await axios.post(`https://api.theeverestnews.com/api/articles/update-share-count/${id}/share`, {
        platform,
      });
    } catch (error) {
      console.error(`Error updating share count for ${platform}:`, error);
    }
  }


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
    <div className='flex flex-row justify-center items-center'>
      {advertisements.length > 0 ? (
        <div>
          {advertisements.map((advertisement) => (
            <div key={advertisement._id} onClick={() => handleAdvertisementClick(advertisement.websiteLink)}>
              <img className='rounded' src={`https://api.theeverestnews.com/${advertisement.imagePath}`} alt="Advertisement" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
  
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*(?:\/|v=)|[^\/]*\/))([^"&?\/\s]{11})/);
    return match && match[1];
  };

  const formatTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const articleTime = new Date(timestamp);
    const timeDifference = currentTime - articleTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const toNepaliNumber = (number) => {
      const nepaliNumbers = ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०'];
      return number.toString().split('').map(digit => nepaliNumbers[parseInt(digit, 10) - 1]).join('');
    };

    if (years > 0) return `${toNepaliNumber(years)} वर्ष${years > 1 ? '' : ''} अगाडि`;
    if (months > 0) return `${toNepaliNumber(months)} महिना${months > 1 ? '' : ''} अगाडि`;
    if (days > 0) return `${toNepaliNumber(days)} दिन${days > 1 ? '' : ''} अगाडि`;
    if (hours > 0) return `${toNepaliNumber(hours)} घण्टा${hours > 1 ? '' : ''} अगाडि`;
    if (minutes > 0) return `${toNepaliNumber(minutes)} मिनेट${minutes > 1 ? '' : ''} अगाडि`;

    return `${toNepaliNumber(seconds)} सेकेन्ड${seconds > 1 ? '' : ''} अगाडि`;
  };

  const imageUri = article && article.photos && article.photos.length > 0 ? `https://api.theeverestnews.com/uploads/articles/${article.photos[0].split('/').pop()}` : '';


  
  return (
    <div> 
      <div className="mx-3 md:mx-10 lg:mx-20">
      <div className="mt-6">
        <AdvertisementComponent position="top" />
      </div>
        {!loading && article && (
          <div key={article._id} className="my-5">
            <h1 className="text-3xl font-bold mb-2">{article.headline}</h1>
            <h4 className="text-lg mb-4">{article.subheadline}</h4>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                {authors && authors.length > 0 && authors.map((author, index) => (
                  <a key={index} href={`/author/${author._id}`} className="flex items-center space-x-1">
                    <img
                      src={`https://api.theeverestnews.com/uploads/authors/${author.photo}`}
                      alt={`${author.firstName} ${author.lastName}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm">{`${author.firstName} ${author.lastName}`}</span>
                  </a>
                ))}
                <p className="text-gray-600">
                  <span className="inline-block mr-1">
                    <FaClock />
                  </span>
                  {formatTimeDifference(article.createdDate)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-gray-600 flex items-center">
                  Share <FaShareAlt />
                  {loading ? 'Loading...' : article.shareCount}
                </p>
                <button onClick={handleFacebookShare} style={{ color: '#1877F2', fontSize: '24px' }}><FaFacebook /></button>
                <button onClick={handleFacebookMessengerShare} style={{ color: '#00B2FF', fontSize: '24px' }}><FaFacebookMessenger /></button>
                <button onClick={handleTwitterShare} style={{ color: '#000000', fontSize: '24px' }}><BsTwitterX /></button>
                <button onClick={handleWhatsappShare} style={{ color: '#25D366', fontSize: '24px' }}><FaWhatsapp /></button>
              </div>
            </div>
            <hr className="my-4" />
            {article.photos && article.photos.length > 0 && (
              <div className="flex justify-center ">
                {article.photos.map((photo, index) => {
                  const fileName = photo.split('/').pop();
                  return (
                    <div key={index} className=" overflow-hidden">
                      <img
                        src={`https://api.theeverestnews.com/uploads/articles/${fileName}`}
                        alt={`Photo ${index}`}
                        className="img-fluid rounded"
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <div className="my-4 font-medium text-xl">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            {article.youtubeLink && (
              <div className="my-4">
                <strong>YouTube Video:</strong>
                <div className="w-full h-96">
                  <YouTube videoId={getYouTubeVideoId(article.youtubeLink)} />
                </div>
              </div>
            )}
           {tags && tags.length > 0 && (
  <div className="flex flex-wrap justify-center mt-4">
    {tags.map((tag, index) => (
      <a 
        href={`/tag/${tag._id}`} 
        key={index} 
        className="bg-gradient-to-r from-[#25609A] to-[#749ec9] text-white text-sm font-medium mr-2 mb-2 px-4 py-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      >
        {tag.name}
      </a>
    ))}
  </div>
)}


          </div>
        )}
       
        {error && (
          <div>Error fetching article: {error}</div>
        )}
         <div className="mt-6">
        <AdvertisementComponent position="below_category" />
      </div>
        <hr className="my-4" />
        <div className="mt-6">
        <AdvertisementComponent position="middle" />
      </div>
        <ReadMore/>
        <div className="mt-6">
        <AdvertisementComponent position="top" />
      </div>
      </div>
      <div className="mt-6">
        <AdvertisementComponent position="bottom" />
      </div>
      <div className="mt-6">
    </div>
    </div>
  );
};

 export default ArticlePage;