import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaClock, FaPhotoVideo } from 'react-icons/fa';

const ARTICLES_API = 'https://api.theeverestnews.com/api/articles/category/फोटोग्यालरी ';
const AUTHORS_API = 'https://api.theeverestnews.com/api/authors';
const AUTHOR_IMAGE_BASE_URL = 'https://api.theeverestnews.com/uploads/authors/';
const ARTICLE_IMAGE_BASE_URL = 'https://api.theeverestnews.com/uploads/articles/';

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
                src={`https://api.theeverestnews.com/${advertisement.imagePath}`}
                alt="Advertisement"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Entertainment = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticlesAndAuthors = async () => {
      try {
        const [articlesResponse, authorsResponse] = await Promise.all([
          axios.get(ARTICLES_API),
          axios.get(AUTHORS_API),
        ]);

        let articles = articlesResponse.data.data;
        const authors = authorsResponse.data.authors;

        // Sort articles by createdAt in descending order
        articles.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        const articlesWithAuthorInfo = articles.slice(0, 6).map((article) => {
          const authorNameFromArticle = article.selectedAuthors[0]; 

          const author = authors.find((author) => 
            `${author.firstName} ${author.lastName}` === authorNameFromArticle
          );

          const articlePhoto = article.photos && article.photos.length > 0
            ? `${ARTICLE_IMAGE_BASE_URL}${article.photos[0].split('/').pop()}`
            : null;

          return {
            ...article,
            authorName: author ? `${author.firstName} ${author.lastName}` : null,
            authorPhoto: author ? `${AUTHOR_IMAGE_BASE_URL}${author.photo}` : null,
            articlePhoto: articlePhoto,
            authorId: author ? author._id : null,
          };
        });

        setArticles(articlesWithAuthorInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles and authors:', error);
        setError('Error fetching articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticlesAndAuthors();
  }, []);

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

  const handleAuthorClick = (authorId) => {
    router.push(`/author/${authorId}`);
  };

  const handleArticleClick = async (id) => {
    console.log(`Article clicked: ${id}`);
    try {
      await axios.put(`https://api.theeverestnews.com/api/articles/increment-views/${id}`);
      router.push(`/article/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  const handleCategoryClick = () => {
    router.push('/category/फोटोग्यालरी');
  };

  return (
    <div className="mx-3 md:mx-10 lg:mx-18">
      {loading ? (
        <p className="text-center text-gray-500"></p>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          <AdvertisementComponent position="top" />
          <div className="my-2">
            <h1
              className="text-2xl font-extrabold text-white bg-[#25609A] py-4 px-8 rounded-t-lg shadow-lg cursor-pointer hover:bg-[#7BB660] transition-all duration-300 ease-in-out flex justify-center items-center text-center"
              onClick={handleCategoryClick}
            >
              फोटो ग्यालरी 
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {articles.map((article) => (
              <div
                key={article._id}
                className="relative bg-black text-white rounded-lg overflow-hidden"
                onClick={() => handleArticleClick(article._id)}
              >
                {article.articlePhoto ? (
                  <>
                    <img
                      src={article.articlePhoto}
                      alt={article.headline}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <h2 className="text-xl font-semibold absolute bottom-2 left-2 z-10">
                        {article.headline}
                      </h2>
                      <FaPhotoVideo className="absolute top-2 right-2 text-white text-2xl z-10" />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-56 bg-gray-800">
                    <p className="text-gray-500">Article photo not available</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <AdvertisementComponent position="bottom" />
        </>
      )}
    </div>
  );
};

export default Entertainment;
