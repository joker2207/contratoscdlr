import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Importar el ícono de la papelera de reciclaje desde react-icons/fa

const CopagoCalculator = ({ selectedResults }) => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [totalCopago, setTotalCopago] = useState(0);
  const [procedureSelections, setProcedureSelections] = useState([]);

  const levels = {
    a: { percentage: 0.115, max: 337999 },
    b: { percentage: 0.173, max: 1354351 },
    c: { percentage: 0.23, max: 2708700 },
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleValueClick = (value, columnName) => {
    if (isNaN(value)) {
      alert('Seleccione bien el valor');
    } else {
      const roundedValue = customRound(parseFloat(value));
      setProcedureSelections(prevSelections => [
        ...prevSelections, 
        { value: roundedValue, percentage: 100, columnName }  // Default percentage to 100%
      ]);
    }
  };

  const customRound = (value) => {
    const remainder = value % 100;
    if (remainder < 50) {
      return value - remainder; // Redondea hacia abajo
    } else {
      return value + (100 - remainder); // Redondea hacia arriba
    }
  };

  const calculateTotalCopago = () => {
    if (procedureSelections.length > 0 && selectedLevel) {
      const level = levels[selectedLevel];
      let sumCopagos = procedureSelections.reduce((acc, selection) => {
        let adjustedValue = selection.value * (selection.percentage / 100);
        let copagoValue = adjustedValue * level.percentage;
        if (copagoValue > level.max) {
          copagoValue = level.max;
        }
        return acc + copagoValue;
      }, 0);
      setTotalCopago(customRound(sumCopagos));
    }
  };

  const handlePercentageChange = (index, newPercentage) => {
    const newSelections = [...procedureSelections];
    newSelections[index].percentage = newPercentage;
    setProcedureSelections(newSelections);
  };

  const handleDeleteSelection = (index) => {
    setProcedureSelections(prevSelections => prevSelections.filter((_, i) => i !== index));
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
                    <td key={cellIndex} onClick={() => handleValueClick(cell, result.headers[cellIndex])}>
                      ${customRound(Math.round(cell)).toLocaleString()} {/* Formato con signo de peso */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="selected-values">
            {procedureSelections.map((selection, index) => (
              <div key={index} className="procedure-selection">
                <span>{selection.columnName}: ${selection.value.toLocaleString()}</span> {/* Muestra el nombre de la columna y el valor */}
                <select 
                  value={selection.percentage} 
                  onChange={(e) => handlePercentageChange(index, parseInt(e.target.value))}
                >
                  <option value={100}>100%</option>
                  <option value={60}>60%</option>
                  {/* Puedes agregar más opciones de porcentaje si es necesario */}
                </select>
                <FaTrashAlt 
                  className="delete-icon" 
                  onClick={() => handleDeleteSelection(index)} 
                  title="Eliminar este copago" 
                /> {/* Icono de papelera de reciclaje */}
              </div>
            ))}
          </div>
          <div className="copago-controls">
            <select onChange={handleLevelChange} value={selectedLevel} className="select-level">
              <option value="">Seleccionar Nivel</option>
              <option value="a">Nivel A</option>
              <option value="b">Nivel B</option>
              <option value="c">Nivel C</option>
            </select>
            <button onClick={calculateTotalCopago} className="calculate-button">Calcular Copago Total</button>
          </div>
          {totalCopago !== 0 && (
            <div className="copago-result">
              <p>Copago Total: <strong>${totalCopago.toLocaleString()}</strong></p> {/* Formato con signo de peso */}
              {totalCopago >= levels[selectedLevel].max && <p>Tope máximo para cobrar alcanzado</p>}
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
