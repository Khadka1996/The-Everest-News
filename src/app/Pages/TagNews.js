"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import Link from 'next/link';

const TagNews = () => {
  const [tag, setTag] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tagNames, setTagNames] = useState([]);
  const [authorDetailsArray, setAuthorDetailsArray] = useState([]);
  const articlesPerPage = 7;

  const { tagId } = useParams();
  // const navigate = useNavigate();

  useEffect(() => {
    fetchTagDetails();
  }, [currentPage, tagId]);

  const fetchTagDetails = async () => {
    try {
      const tagResponse = await axios.get(`https://api.theeverestnews.com/api/tags/${tagId}`);
      const fetchedTag = tagResponse.data?.data;

      if (fetchedTag) {
        setTag(fetchedTag);
        setLoading(false);
      } else {
        console.error('Tag not found.');
        setLoading(false);
      }

      const articlesResponse = await axios.get('https://api.theeverestnews.com/api/articles/all');
      const tagArticles = articlesResponse.data?.data.filter(article =>
        article.selectedTags.includes(tagId)
      ) || [];

      setArticles(tagArticles);

      const tagNamesPromises = tagArticles.map(article =>
        Promise.all(article.selectedTags.map(articleTagId => fetchTagName(articleTagId)))
      );

      Promise.all(tagNamesPromises)
        .then(resolvedTagNames => {
          setTagNames(resolvedTagNames);
        })
        .catch(error => {
          console.error('Error fetching tag names:', error);
          setTagNames([]);
        });

      const authorDetailsPromises = tagArticles.map(article =>
        Promise.all(article.selectedAuthors.map(authorId => fetchAuthorDetails(authorId)))
      );

      const resolvedAuthorDetailsArray = await Promise.all(authorDetailsPromises).catch(error => {
        console.error('Error fetching author details:', error);
        return [];
      });

      setAuthorDetailsArray(resolvedAuthorDetailsArray.flat());
    } catch (error) {
      console.error('Error fetching tag details:', error);
      setLoading(false);
    }
  };

  const fetchTagName = async (tagId) => {
    try {
      const response = await axios.get(`https://api.theeverestnews.com/api/tags/${tagId}`);
      const tagName = response.data?.data?.name || '';
      return { id: tagId, name: tagName };
    } catch (error) {
      console.error('Error fetching tag name:', error);
      return { id: '', name: '' };
    }
  };

  const fetchAuthorDetails = async (authorId) => {
    try {
      const authorResponse = await axios.get(`https://api.theeverestnews.com/api/authors/${authorId}`);
      const author = authorResponse.data?.author;
      return { fullName: `${author?.firstName} ${author?.lastName}`, photo: author?.photo };
    } catch (error) {
      console.error('Error fetching author details:', error);
      return { fullName: '', photo: '' };
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTagClick = (clickedTagId) => {
    navigate(`/tag/${clickedTagId}`);
  };

  const getPaginatedArticles = () => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    return articles.slice(indexOfFirstArticle, indexOfLastArticle);
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

  if (loading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Articles related to {tag.name}</h2>
      {getPaginatedArticles().map((article, index) => (
        <div key={article._id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
          <a href={`/article/${article._id}`} className="text-xl font-semibold text-blue-600 hover:text-blue-800">
            {article.headline}
          </a>
          {article.subheadline && <p className="mt-2 text-gray-700">{article.subheadline}</p>}
          {authorDetailsArray[index] && authorDetailsArray[index].photo && (
            <div className="mt-4 flex items-center">
              <Link to={`/author/${article.selectedAuthors[0]}`} className="flex items-center mr-4">
                <img
                  src={`https://api.theeverestnews.com/uploads/authors/${authorDetailsArray[index].photo}`}
                  alt="Author"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-gray-700">{authorDetailsArray[index].fullName}</span>
              </Link>
              <p className="flex items-center text-gray-500">
                <FaClock className="mr-1" />
                {formatTimeDifference(article.createdDate)}
              </p>
            </div>
          )}
          {article.photos && article.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {article.photos.map((photo, index) => (
                <img
                  key={index}
                  src={`https://api.theeverestnews.com/uploads/articles/${photo.split('/').pop()}`}
                  alt={`Photo ${index}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
          <hr className="my-4" />
          {tagNames[index] !== undefined ? (
            <p className="text-gray-600">
              Tags: {tagNames[index].map(tag => (
                <span
                  key={tag.id}
                  className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full cursor-pointer mr-2 mb-2"
                  onClick={() => handleTagClick(tag.id)}
                >
                  {tag.name}
                </span>
              ))}
            </p>
          ) : (
            <p className="text-gray-500">Loading tags...</p>
          )}
        </div>
      ))}
      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-700 hover:text-white transition`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagNews;