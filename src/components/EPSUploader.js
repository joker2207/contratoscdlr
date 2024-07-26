import React from 'react';

function EPSUploader({ label, onFileSelect, onFilterChange, filters }) {
  const handleFileChange = (e) => {
    onFileSelect(e.target.files, label);
  };

  const handleFilterChange = (filterType) => (e) => {
    onFilterChange(label, filterType, e.target.checked);
  };

  return (
    <div className="eps-uploader">
      <input type="file" multiple onChange={handleFileChange} webkitdirectory="" mozdirectory="" />
      <label>{label}</label>
      <div>
        <label>
          <input
            type="checkbox"
            checked={filters.evento}
            onChange={handleFilterChange('evento')}
          />
          Evento
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.pgp}
            onChange={handleFilterChange('pgp')}
          />
          PGP
        </label>
      </div>
    </div>
  );
}

export default EPSUploader;
