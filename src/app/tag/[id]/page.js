"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import NavbarTop from "@/app/Components/Header/TopHeader";
import Heading from "@/app/Components/Header/MiddleHeader";
import BottomHeader from "@/app/Components/Header/BottomHeader";
import FooterBottom from "@/app/Components/Footer/FooterBottom";
import TrendingArticles from "@/app/Pages/TrendingPage";
import API_URL from "@/app/config";

const TagPage = ({ params }) => {
  const { id } = params;
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const articlesPerPage = 9;

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(9)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-gray-300"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      // Decode the tag name from URL
      const decodedTagName = decodeURIComponent(id);
      const res = await fetch(
        `${API_URL}/api/articles/tag/${decodedTagName}/status/published?page=${page}&limit=${articlesPerPage}`
      );
      const data = await res.json();
      if (data.success) {
        // Sort articles by newest first
        const sortedArticles = (data.data || []).sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setArticles(sortedArticles);
        setTotalCount(data.pagination?.totalCount || 0);
        setCurrentPage(page);
        // Set tag name from the decoded URL param
        setTagName(decodedTagName);
      } else {
        console.error("Error fetching articles:", data.error);
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePageNumbers = () => {
    const totalPages = totalCount ? Math.ceil(totalCount / articlesPerPage) : 1;
    const range = 2;
    let pageNumbers = [];

    if (currentPage - range > 1) {
      pageNumbers.push(1);
      if (currentPage - range > 2) {
        pageNumbers.push('...');
      }
    }

    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
      pageNumbers.push(i);
    }

    if (currentPage + range < totalPages) {
      if (currentPage + range < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, id]);

  const totalPages = Math.ceil(totalCount / articlesPerPage);

  const convertToNepaliNumber = (num) => {
    const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(digit => nepaliNumbers[parseInt(digit)]).join('');
  };

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

  return (
    <div className="">
      <NavbarTop />
      <Heading />
      <BottomHeader />
     
      
      <div className="mx-3 md:mx-10 lg:mx-20">
        <AdvertisementComponent position="nepali_top" />
        
        {!loading && <h1 className="text-3xl font-bold mb-6 text-[#25609A]">{tagName}</h1>}
        
        {loading ? (
          <SkeletonLoader />
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:cursor-pointer transition-all"
                >
                  <Link href={`/article/${article._id}`}>
                    <div className="block cursor-pointer">
                      <div className="relative h-48 bg-gray-300 overflow-hidden">
                        <img
                          src={
                            article.photos && article.photos.length > 0
                              ? `${API_URL}/uploads/articles/${article.photos[0].split("/").pop()}`
                              : "/placeholder.jpg"
                          }
                          alt={article.headline}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h2 className="text-base font-bold text-gray-800 hover:text-[#25609A] line-clamp-2">
                          {article.headline}
                        </h2>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded bg-[#25609A] text-white disabled:bg-gray-300 hover:bg-[#1a3f5a] transition"
                >
                  पहिले
                </button>

                {generatePageNumbers().map((pageNumber, index) => (
                  <span key={index}>
                    {pageNumber === '...' ? (
                      <span className="px-2">...</span>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                          currentPage === pageNumber
                            ? 'bg-[#7BB660] text-white font-bold'
                            : 'bg-[#25609A] text-white hover:bg-[#1a3f5a]'
                        }`}
                      >
                        {convertToNepaliNumber(pageNumber)}
                      </button>
                    )}
                  </span>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded bg-[#25609A] text-white disabled:bg-gray-300 hover:bg-[#1a3f5a] transition"
                >
                  पछि
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">यो ट्यागमा कोई लेख उपलब्ध छैन।</p>
          </div>
        )}

        <div className="mb-6">
          <AdvertisementComponent position="nepali_middletag" />
        </div>
      </div>
      <div className="flex flex-row flex-wrap lg:flex-nowrap">
        <TrendingArticles />
      </div>
      <div className="mb-6 mt-6">
        <AdvertisementComponent position="nepali_belowtag" />
      </div>
      <FooterBottom />
    </div>
  );
};

export default TagPage;
