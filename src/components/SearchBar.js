import React, { useState } from 'react';

const SearchBar = ({ onSearch, epsOptions }) => {
  const [query, setQuery] = useState('');
  const [selectedEps, setSelectedEps] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedEps(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query, selectedEps);
  };

  return (
    <div className="search-bar">
      <input type="text" value={query} onChange={handleInputChange} placeholder="Buscar..." />
      <select value={selectedEps} onChange={handleSelectChange}>
        <option value="">Seleccionar EPS</option>
        {epsOptions.map(eps => (
          <option key={eps} value={eps}>{eps}</option>
        ))}
      </select>
      <button onClick={handleSearch} className="hover-button">Buscar</button>
    </div>
  );
};

export default SearchBar;
