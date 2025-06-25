import React, { useState } from 'react';

const SearchComponent = ({ onSearch, placeholder = "Search tweets..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Real-time search after 2 characters
    if (value.length >= 2 || value.length === 0) {
      onSearch(value);
    }
  };

  return (
    <div className="search-component">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className="clear-search"
            >
              ×
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
