import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import axios from 'axios';
import { FaClock, FaFacebook, FaWhatsapp, FaFacebookMessenger, FaShareAlt} from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import NavbarTop from '@/app/Components/Header/TopHeader'; 
import MiddleHeader from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import Photos from '@/app/ImageVideo/Photo';
import Video from '@/app/ImageVideo/Video';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import LowerHeading from '@/app/Components/Footer/LowerHeading';



import '@/app/globals.css'; 
import ReadMore from '@/app/Pages/ReadMore';

const ServerPage = ({ data, tags, authors}) => {
  const router = useRouter();
  
  if (!data) {
    return <p>Error loading data.</p>;
  }

  const { headline,subheadline, content, createdAt, photos, shareCount} = data;

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
      const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      return number.toString().split('').map(digit => nepaliNumbers[parseInt(digit, 10)]).join('');
    };

    if (years > 0) return `${toNepaliNumber(years)} वर्ष${years > 1 ? '' : ''} अगाडि`;
    if (months > 0) return `${toNepaliNumber(months)} महिना${months > 1 ? '' : ''} अगाडि`;
    if (days > 0) return `${toNepaliNumber(days)} दिन${days > 1 ? '' : ''} अगाडि`;
    if (hours > 0) return `${toNepaliNumber(hours)} घण्टा${hours > 1 ? '' : ''} अगाडि`;
    if (minutes > 0) return `${toNepaliNumber(minutes)} मिनेट${minutes > 1 ? '' : ''} अगाडि`;

    return `${toNepaliNumber(seconds)} सेकेन्ड${seconds > 1 ? '' : ''} अगाडि`;
  };

  const handleShare = (platform) => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      messenger: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=123456789`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(headline || '')}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${headline || ''} - ${window.location.href}`)}`,
    };

    window.open(shareUrls[platform], '_blank');
  };

  const imageUri = photos && photos.length > 0 ? `https://api.theeverestnews.com/uploads/articles/${photos[0].split('/').pop()}` : '';

  return (
    <>
      <NavbarTop/>
       <MiddleHeader/>
        <BottomHeader/>            
      <Head>
        <title>{headline}</title>
        <meta name="description" content={content} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://theeverestnews.com${router.asPath}`} />
        <meta property="og:title" content={headline} />
        <meta property="og:description" content={content} />
        <meta property="og:image" content={imageUri} />
      </Head>
      <div className="mx-3 md:mx-10 lg:mx-20">
        <div className="mt-6">
          <h1 className="text-3xl font-bold mb-2">{headline}</h1>
          <h4 className="text-lg mb-4">{subheadline}</h4>
          <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
          <span className="text-sm">{`${authors.firstName} ${authors.lastName}`}</span>

              <p className="text-gray-600">
                <span className="inline-block mr-1">
                  <FaClock />
                </span>
                {formatTimeDifference(createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-gray-600 flex items-center">
                Share <FaShareAlt />
                {shareCount}
              </p>
              <button onClick={() => handleShare('facebook')} style={{ color: '#1877F2', fontSize: '24px' }}><FaFacebook /></button>
              <button onClick={() => handleShare('messenger')} style={{ color: '#00B2FF', fontSize: '24px' }}><FaFacebookMessenger /></button>
              <button onClick={() => handleShare('twitter')} style={{ color: '#000000', fontSize: '24px' }}><BsTwitterX /></button>
              <button onClick={() => handleShare('whatsapp')} style={{ color: '#25D366', fontSize: '24px' }}><FaWhatsapp /></button>
            </div>
          </div>
          <div className="mb-4">
            {photos && photos.length > 0 && (
              <img
                src={imageUri}
                alt={headline}
                className="w-full h-auto rounded"
              />
            )}
          </div>
          <div className="prose prose-lg max-w-none mb-6" dangerouslySetInnerHTML={{ __html: content }}></div>
          {tags && tags.length > 0 && (
            <div className="mt-4">
              <strong>Tags:</strong>
              <div className="flex flex-wrap mt-2">
                {tags.map((tag, index) => (
                  <a href={`/tag/${tag._id}`} key={index} className="text-blue-500 text-sm mr-2">
                    {tag.name}
                  </a>
                ))}
              </div>
             
            </div>
          )}
         
        </div>
       
      </div>
      <ReadMore/>
        <Video />
        <FooterBottom/>
      <LowerHeading/>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  try {
    const [articleResponse, tagsResponse,authorsResponse] = await Promise.all([
      axios.get(`https://api.theeverestnews.com/api/articles/${id}`),
      axios.get(`https://api.theeverestnews.com/api/articles/${id}/tags`),
      axios.get(`https://api.theeverestnews.com/api/articles/${id}/authors`),

    ]);

    const articleData = articleResponse.data.data || null;
    const tagsData = tagsResponse.data.data || [];
    const authorsData = authorsResponse.data.data || [];

    return {
      props: {
        data: articleData,
        tags: tagsData,
        authors: authorsData,
      },
    };
  } catch (error) {
    console.error('Error fetching article data:', error);
    return {
      props: {
        data: null,
        tags: [],
        authors: [],
      },
    };
  }
};

export default ServerPage;