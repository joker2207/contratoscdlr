import React, { useState } from 'react';

const DirectoryUploader = ({ onDirectoryUpload }) => {
  const [selectedFolder, setSelectedFolder] = useState('');

  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
  };

  const handleChange = (e) => {
    if (selectedFolder) {
      onDirectoryUpload(e.target.files, selectedFolder);
      setSelectedFolder(''); // Reset the selected folder after upload
    } else {
      alert('Please select a folder.');
    }
  };

  return (
    <div>
      <select value={selectedFolder} onChange={handleFolderChange}>
        <option value="">Select a folder</option>
        <option value="mutual">Mutual</option>
        <option value="coosalud">Coosalud</option>
        <option value="ecopetrol">Ecopetrol</option>
        <option value="cajacopi">Cajacopi</option>
        <option value="armada">Armada</option>
        <option value="coosalud2024">Coosalud 2024</option>
        <option value="magisterio">Magisterio</option>
      </select>
      <input type="file" webkitdirectory="true" directory="true" multiple onChange={handleChange} />
    </div>
  );
};

export default DirectoryUploader;
