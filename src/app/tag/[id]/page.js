"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Import axios for API requests
import NavbarTop from '@/app/Components/Header/TopHeader';
import Heading from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import TrendingArticles from '@/app/Pages/TrendingPage';
import LatestUpdates from '@/app/Pages/LatestPage';

const TagPage = ({ params }) => {
  const { id } = params;
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('https://api.theeverestnews.com/api/articles/all');
        const data = await res.json();
        setArticles(data.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await fetch('https://api.theeverestnews.com/api/tags');
        const data = await res.json();
        const tag = data.data.find(tag => tag._id === id);
        setTagName(tag ? tag.name : 'Unknown');
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchArticles();
    fetchTags();
  }, [id]);

  const filteredArticles = articles.filter(article => article.selectedTags.includes(id));
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * articlesPerPage;
  const displayedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  // Advertisement Component
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
        {advertisements.map((advertisement, index) => (
          <div key={index} className='advertisement' onClick={() => handleAdvertisementClick(advertisement.websiteLink)}>
            <img className='rounded' src={`https://api.theeverestnews.com/${advertisement.imagePath}`} alt="Advertisement" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <NavbarTop />
      <Heading />
      <BottomHeader />
      <div className="mx-3 md:mx-10 lg:mx-20">
      <div className="container mx-auto px-4 py-8">
      <AdvertisementComponent position="top" />

      <h1 className="text-3xl font-semibold mb-4 text-[#7BB660]">{tagName.slice(1)}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayedArticles.map(article => (
            <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={`/article/${article._id}`}>
                <div className="block cursor-pointer">
                  <img
                    src={article.photos && article.photos.length > 0 ? `https://api.theeverestnews.com/uploads/articles/${article.photos[0].split('/').pop()}` : '/placeholder.jpg'}
                    alt={article.headline}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-[#25609A]">{article.headline}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <span
              key={pageNumber}
              className={`mx-2 cursor-pointer text-xl ${currentPage === pageNumber + 1 ? 'font-bold' : ''}`}
              onClick={() => handlePageChange(pageNumber + 1)}
            >
              {pageNumber + 1}
            </span>
          ))}
        </div>
      </div>
     
      <div className="mb-6">
      <AdvertisementComponent position="middle" />
      </div>
    </div>
    <div className="flex flex-row flex-wrap lg:flex-nowrap">
      <TrendingArticles/>
        <LatestUpdates/>
      </div>
      <div className="mb-6 mt-6">
      <AdvertisementComponent position="bottom" />
      </div>
    <FooterBottom/>

    </div>
  );
};

export default TagPage;