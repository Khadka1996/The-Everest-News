import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaClock } from 'react-icons/fa';

const ARTICLES_API = 'https://api.theeverestnews.com/api/articles/category/अन्तर्राष्ट्रिय';
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

const International = () => {
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

        const articlesWithAuthorInfo = articles.slice(0, 4).map((article) => {
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
    router.push('/category/अन्तर्राष्ट्रिय');
  };

  return (
    <div className="mx-3 md:mx-9 lg:mx-18">
      {loading ? (
        <p className="text-center text-gray-500"></p>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          <AdvertisementComponent position="middle" />
          <div className="my-2">
          <h1
            className="text-2xl font-extrabold text-white bg-[#25609A] py-2 px-6 rounded-t-lg shadow-lg cursor-pointer hover:bg-[#7BB660] transition-all duration-300 ease-in-out"
            onClick={handleCategoryClick}
          >
            अन्तर्राष्ट्रिय
          </h1>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {articles.map((article) => (
              <div key={article._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                {article.articlePhoto ? (
                  <a
                    href={`/article/${article._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleArticleClick(article._id);
                    }}
                  >
                    <img
                      src={article.articlePhoto}
                      alt={article.headline}
                      className="w-full h-56 object-cover cursor-pointer"
                    />
                  </a>
                ) : (
                  <p className="text-center p-4 text-gray-500">Article photo not available</p>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 cursor-pointer hover:text-[#25609A]">
                    <a
                      href={`/article/${article._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleArticleClick(article._id);
                      }}
                    >
                      {article.headline}
                    </a>
                  </h2>
                  {article.subheadline && (
                    <h3 className="text-sm text-gray-600 mb-4">{article.subheadline}</h3>
                  )}
                  <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      <span>{formatTimeDifference(article.updatedDate || article.createdDate)}</span>
                    </div>
                    {article.authorName && (
                      <div className="flex items-center">
                        {article.authorPhoto && (
                          <img
                            src={article.authorPhoto}
                            alt={article.authorName}
                            className="h-8 w-8 rounded-full object-cover mr-2"
                          />
                        )}
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() =>
                            article.authorId && handleAuthorClick(article.authorId)
                          }
                        >
                          {article.authorName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <AdvertisementComponent position="below_category" />
    </div>
  );
};

export default International;
