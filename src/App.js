import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import EPSUploader from './components/EPSUploader';
import './styles.css';
import logo from './logo.png';

function App() {
  const [fileInputs, setFileInputs] = useState({
    coosalud: [],
    ecopetrol: [],
    cajacopi: [],
    armada: [],
    coosalud2024: [],
    magisterio: [],
    nuevaeps: [],
    mutual: []
  });
  const [contracts, setContracts] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState(null);
  const [pgpFilters, setPgpFilters] = useState({
    coosalud: true,
    ecopetrol: true,
    cajacopi: true,
    armada: true,
    coosalud2024: true,
    magisterio: true,
    nuevaeps: true,
    mutual: true
  });
  const [eventoFilters, setEventoFilters] = useState({
    coosalud: true,
    ecopetrol: true,
    cajacopi: true,
    armada: true,
    coosalud2024: true,
    magisterio: true,
    nuevaeps: true,
    mutual: true
  });
  const [epsOptions, setEpsOptions] = useState([]);

  useEffect(() => {
    if (window.Worker) {
      const workerInstance = new Worker(new URL('./worker.js', import.meta.url));
      workerInstance.onmessage = (e) => {
        setContracts(prevContracts => [...prevContracts, ...e.data]);
        setLoading(false);
        const options = Object.keys(fileInputs).filter(folder => fileInputs[folder].length > 0);
        setEpsOptions(options);
      };
      setWorker(workerInstance);
    }
  }, [fileInputs]);

  const handleFileSelect = (files, folder) => {
    setFileInputs(prevInputs => ({
      ...prevInputs,
      [folder]: files
    }));
  };

  const handleFilterChange = (folder, filterType, isChecked) => {
    if (filterType === 'pgp') {
      setPgpFilters(prevFilters => ({
        ...prevFilters,
        [folder]: isChecked
      }));
    } else if (filterType === 'evento') {
      setEventoFilters(prevFilters => ({
        ...prevFilters,
        [folder]: isChecked
      }));
    }
  };

  const handleLoadContracts = () => {
    setLoading(true);
    setContracts([]);
    for (const folder of Object.keys(fileInputs)) {
      if (fileInputs[folder].length > 0) {
        worker.postMessage({
          files: fileInputs[folder],
          folder,
          filters: {
            pgp: pgpFilters[folder],
            evento: eventoFilters[folder]
          }
        });
      }
    }
  };

  const handleSearch = (query, selectedEps) => {
    const filteredResults = contracts
      .filter(contract => selectedEps === '' || contract.folder === selectedEps)
      .map(contract => {
        const filteredData = contract.data.map(row => {
          const rowString = row.join(' ');
          const queryIndex = rowString.toLowerCase().indexOf(query.toLowerCase());
          if (queryIndex !== -1) {
            return {
              row,
              highlighted: row.map(cell => cell.toString().toLowerCase().includes(query.toLowerCase()))
            };
          }
          return null;
        }).filter(item => item !== null);

        return filteredData.length > 0 ? {
          ...contract,
          data: filteredData
        } : null;
      }).filter(contract => contract);

    setResults(filteredResults);
  };

  return (
    <div>
      <header>
        <img src={logo} alt="Logo" className="logo" />
        <h1>Buscador de Contratos</h1>
      </header>
      <div className="container">
        <div className="eps-uploaders">
          {Object.keys(fileInputs).map((folder) => (
            <EPSUploader
              key={folder}
              label={folder}
              onFileSelect={handleFileSelect}
              onFilterChange={handleFilterChange}
              filters={{
                pgp: pgpFilters[folder],
                evento: eventoFilters[folder]
              }}
            />
          ))}
        </div>
        <button className="action-button" onClick={handleLoadContracts}>Cargar Información</button>
        {loading && <p className="loading-text">Cargando contratos...</p>}
        <SearchBar onSearch={handleSearch} epsOptions={epsOptions} />
        <div className="results-container">
          {results.map((result, index) => (
            <div key={index}>
              <h3>Folder: {result.folder}</h3>
              <h4>File: {result.fileName}</h4>
              <table>
                <thead>
                  <tr>
                    {result.headers.map((header, headerIndex) => (
                      <th key={headerIndex}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.map(({ row, highlighted }, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => {
                        const formattedCell = typeof cell === 'number' ? Math.round(cell).toString() : cell;
                        return (
                          <td key={cellIndex} className={highlighted[cellIndex] ? 'highlight' : ''}>
                            {formattedCell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;




