"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      if (searchTerm.trim() === '') {
        return;
      }

      const response = await axios.get(`https://api.theeverestnews.com/api/articles/all?search=${searchTerm}`);

      if (!response.data.success) {
        throw new Error('Failed to fetch articles');
      }

      const searchTermLower = searchTerm.toLowerCase();

      const matchingResults = response.data.data.filter(
        (article) => article.headline.toLowerCase().includes(searchTermLower)
      );

      setSearchResults(matchingResults.slice(0, 5));
    } catch (error) {
      setError('Error fetching articles');
      console.error('Error fetching articles:', error);
    }
  };

  const handleArticleClick = (articleId) => {
    // Implement the logic for handling the click on the article
    // For example, you can navigate to the article page using Next.js router
  };

  const highlightKeywords = (text, keywords) => {
    // Implement the logic for highlighting keywords in the text
    // For example, you can use HTML elements or CSS styles for highlighting
    return text;
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="relative ">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search articles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-l py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
        />
        <button onClick={toggleSearch} className="bg-[#25609A] text-white px-4 py-3 rounded-r focus:outline-none focus:ring focus:border-blue-300">
          <FaSearch />
        </button>
      </div>
      {showSearch && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded w-full shadow-lg">
          <h2 className="p-4 border-b border-gray-300">Search Results:</h2>
          <div className="overflow-y-auto max-h-60">
            {searchResults.map((article) => (
              <div key={article._id} className="p-4 border-b border-gray-300">
                <Link href={`/article/${article._id}`}>
                  <a onClick={() => handleArticleClick(article._id)} className="text-[#25609A] hover:underline">
                    {highlightKeywords(article.headline, searchTerm)}
                  </a>
                </Link>
              </div>
            ))}
            {searchResults.length === 0 && searchTerm.trim() !== '' && <p className="p-4">No results found.</p>}
          </div>
        </div>
      )}
      {error && <p className="text[#25609A]">{error}</p>}
    </div>
  );
};

export default Search;