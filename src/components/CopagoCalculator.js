import React, { useState } from 'react';

const CopagoCalculator = ({ selectedResults }) => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [copago, setCopago] = useState(null);
  const [selectedProcedureValue, setSelectedProcedureValue] = useState(null);

  const levels = {
    a: { percentage: 0.115, max: 337999 },
    b: { percentage: 0.173, max: 1354351 },
    c: { percentage: 0.23, max: 2708700 },
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleValueClick = (value) => {
    if (isNaN(value)) {
      alert('Seleccione bien el valor');
    } else {
      setSelectedProcedureValue(Math.round(parseFloat(value)));
    }
  };

  const roundToNearestHundred = (value) => {
    return Math.round(value / 100) * 100;
  };

  const calculateCopago = () => {
    if (selectedProcedureValue !== null && selectedLevel) {
      const level = levels[selectedLevel];
      let copagoValue = selectedProcedureValue * level.percentage;
      if (copagoValue > level.max) {
        copagoValue = level.max;
      }
      setCopago(roundToNearestHundred(copagoValue));
    }
  };

  return (
    <div>
      {selectedResults && selectedResults.length > 0 ? (
        <div>
          <h3>Procedimientos seleccionados:</h3>
          <table>
            <thead>
              <tr>
                {selectedResults[0].headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedResults.map((result, index) => (
                <tr key={index}>
                  {result.row.map((cell, cellIndex) => (
                    <td key={cellIndex} onClick={() => handleValueClick(cell)}>
                      {Math.round(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="selected-value">
            Valor seleccionado: <span>{selectedProcedureValue !== null ? selectedProcedureValue : 'Ninguno'}</span>
          </p>
          <div className="copago-controls">
            <select onChange={handleLevelChange} value={selectedLevel} className="select-level">
              <option value="">Seleccionar Nivel</option>
              <option value="a">Nivel A</option>
              <option value="b">Nivel B</option>
              <option value="c">Nivel C</option>
            </select>
            <button onClick={calculateCopago} className="calculate-button">Calcular Copago</button>
          </div>
          {copago !== null && (
            <div className="copago-result">
              <p>Copago: <strong>{copago}</strong></p>
              {copago >= levels[selectedLevel].max && <p>Tope máximo para cobrar</p>}
            </div>
          )}
        </div>
      ) : (
        <p>No se ha seleccionado ningún procedimiento.</p>
      )}
    </div>
  );
};

export default CopagoCalculator;
