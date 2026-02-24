"use client"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import API_URL from '@/app/config';

const Search = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Focus the input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/api/articles/all?search=${encodeURIComponent(searchTerm)}`);
      
      if (!response.data.success) {
        throw new Error('Failed to fetch articles');
      }

      const searchTermLower = searchTerm.toLowerCase();
      const matchingResults = response.data.data
        .filter(article => 
          article.headline.toLowerCase().includes(searchTermLower) ||
          (article.summary && article.summary.toLowerCase().includes(searchTermLower))
        )
        .slice(0, 5);

      setSearchResults(matchingResults);
    } catch (error) {
      setError('Error fetching articles. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      onClose();
    }
  };

  const highlightText = (text) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <span key={i} className="bg-yellow-200">{part}</span> : 
        part
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto mt-12">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Search Articles</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close search"
        >
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#25609A]"
          />
          <button 
            type="submit"
            className="absolute right-3 text-[#25609A]"
            disabled={isLoading}
          >
            <FaSearch />
          </button>
        </div>
      </form>
      
      <div className="max-h-60 overflow-y-auto">
        {isLoading && (
          <div className="p-4 text-center text-gray-500">Searching...</div>
        )}
        
        {!isLoading && searchResults.length > 0 && (
          <div className="divide-y divide-gray-200">
            {searchResults.map((article) => (
              <Link 
                key={article._id} 
                href={`/article/${article._id}`}
                onClick={onClose}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-[#25609A]">
                  {highlightText(article.headline)}
                </h3>
                {article.summary && (
                  <p className="text-sm text-gray-600 mt-1">
                    {highlightText(article.summary.substring(0, 100))}...
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
        
        {!isLoading && searchTerm && searchResults.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No articles found for {searchTerm}&quot;
          </div>
        )}
        
        {error && (
          <div className="p-4 text-center text-red-500">
            {error}
          </div>
        )}
      </div>
      
      {searchTerm && !isLoading && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={handleSubmit}
            className="text-[#25609A] font-medium hover:underline"
          >
            View all results for {searchTerm}&quot;
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;