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
import Loader from "@/app/articless/loader"; // Import the Loader component

const TagPage = ({ params }) => {
  const { id } = params;
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for page change
  const articlesPerPage = 9;

  const fetchArticles = async (page = currentPage) => {
    setLoading(true); // Set loading true when fetching data
    try {
      const res = await fetch(
        `${API_URL}/api/articles/tag/${id}/status/published`
      );
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
        setTotalCount(data.pagination.totalCount || 0);
      } else {
        console.error("Error fetching articles:", data.error);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false); // Set loading false once fetching is done
    }
  };

  const generatePageNumbers = () => {
    const range = 2; // Number of pages to show before and after the current page
    const totalPages = totalCount ? Math.ceil(totalCount / articlesPerPage) : 1;
    const currentPage = currentPage;
  
    let pageNumbers = [];
  
    // Show the first page
    if (currentPage - range > 1) {
      pageNumbers.push(1);
    }
  
    // Add the previous pages
    for (let i = currentPage - range; i < currentPage; i++) {
      if (i > 0) pageNumbers.push(i);
    }
  
    // Add the current page
    pageNumbers.push(currentPage);
  
    // Add the next pages
    for (let i = currentPage + 1; i <= currentPage + range; i++) {
      if (i <= totalPages) pageNumbers.push(i);
    }
  
    // Show the last page
    if (currentPage + range < totalPages) {
      pageNumbers.push(totalPages);
    }
  
    return pageNumbers;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchArticles(pageNumber); // Fetch new page data when page changes
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tags`);
      const data = await res.json();
      const tag = data.data.find((tag) => tag._id === id);
      setTagName(tag ? tag.name : "Unknown");
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchArticles(); // Fetch articles initially
    fetchTags(); // Fetch tag data initially
  }, [id, currentPage]);

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
        {loading ? (
          <Loader /> // Show loader while loading articles
        ) : (
          <>
            <h1 className="text-3xl font-semibold mb-4 text-[#7BB660]">
              {tagName}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <Link href={`/article/${article._id}`}>
                    <div className="block cursor-pointer">
                      <img
                        src={
                          article.photos && article.photos.length > 0
                            ? `${API_URL}/uploads/articles/${
                                article.photos[0].split("/").pop()
                              }`
                            : "/placeholder.jpg"
                        }
                        alt={article.headline}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-800 hover:text-[#25609A]">
                          {article.headline}
                        </h2>
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
                  className={`mx-2 cursor-pointer text-lg ${currentPage === pageNumber + 1 ? 'font-bold' : ''}`}
                  onClick={() => handlePageChange(pageNumber + 1)}
                >
                  <span
                    className={`inline-block rounded-full p-3 w-10 h-10 bg-[#25609A] border-2 border-grey-600 ${currentPage === pageNumber + 1 ? 'bg-[#7BB761]' : ''} flex items-center justify-center`}
                  >
                    {convertToNepaliNumber(pageNumber + 1)}
                  </span>
                </span>
              ))}
            </div>
          </>
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
