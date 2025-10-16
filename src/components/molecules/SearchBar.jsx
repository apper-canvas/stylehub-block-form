import React, { useState, useRef, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';

const SearchBar = ({ onSearch, placeholder = "Search for products...", className }) => {
  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const mockSuggestions = [
    "Summer dresses", "Denim jackets", "Running shoes", "Casual shirts", 
    "Evening gowns", "Sneakers", "Hoodies", "Formal pants"
  ];

  useEffect(() => {
    if (query.length > 2) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsActive(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsActive(false);
    setSuggestions([]);
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setTimeout(() => setIsActive(false), 200)}
            className="pl-10 pr-12 bg-background border-gray-200 focus:bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                onSearch("");
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {isActive && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center transition-colors duration-150"
            >
              <ApperIcon name="Search" size={16} className="text-gray-400 mr-3" />
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;