import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <input type="text" value={query} onChange={handleInputChange} placeholder="Buscar..." />
      <button onClick={handleSearch} className="hover-button">Buscar</button>
    </div>
  );
};

export default SearchBar;
