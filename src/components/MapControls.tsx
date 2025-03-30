// src/components/MapControls.tsx
import React from 'react';
import { possibleLabels } from '../types/constants';
import { TokenEnum } from '../types/token';
import { TerrainEnum } from '../types/terrain';
import '../css/MapControls.css';

interface MapControlsProps {
  selectedLabel: TerrainEnum;
  setSelectedLabel: (label: TerrainEnum) => void;
  showDifficulty: boolean;
  setShowDifficulty: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  classifyRemainingCells: () => void;
  onReset: () => void;
  selectedTokenType: TokenEnum | null;
  setSelectedTokenType: (type: TokenEnum | null) => void;
  cellSize: number;
  setCellSize: (size: number) => void;
  offsetX: number;
  setOffsetX: (x: number) => void;
  offsetY: number;
  setOffsetY: (y: number) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  selectedLabel,
  setSelectedLabel,
  showDifficulty,
  setShowDifficulty,
  darkMode,
  setDarkMode,
  classifyRemainingCells,
  onReset,
  selectedTokenType,
  setSelectedTokenType,
  cellSize,
  setCellSize,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
}) => {
  const handleNumberChange = (setter: (val: number) => void, value: string, fallback: number) => {
    const regex = /^\d*$/;
    if (regex.test(value)) {
      const parsed = parseInt(value, 10);
      setter(isNaN(parsed) ? fallback : parsed);
    }
  };

  return (
    <div className="map-controls">
      <div className="label-controls actions-row upper-wrapper">
      <div className="label-controls">
        <label>Etichetta attiva:</label>
        <select
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value as TerrainEnum)}
        >
          <option value={TerrainEnum.NO_TYPE}>-- Nessuna --</option>
          {possibleLabels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="label-controls">
        <label>Tipo di pedina (opzionale):</label>
        <select
          value={selectedTokenType ?? ''}
          onChange={(e) =>
            setSelectedTokenType(e.target.value === '' ? null : (e.target.value as TokenEnum))
          }
        >
          <option value="">-- Nessuna --</option>
          {Object.values(TokenEnum).map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>
      </div>

      <div className="toggles">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showDifficulty}
            onChange={(e) => setShowDifficulty(e.target.checked)}
          />
          Mostra livelli di difficoltà
        </label>

        <label className="toggle-label">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Tema scuro (solo griglia)
        </label>
      </div>

      <div className="label-controls actions-row">
        <button className="classify-button" onClick={classifyRemainingCells}>
          Classifica celle rimanenti
        </button>
        <button className="classify-button danger" onClick={onReset}>
          Reset celle
        </button>
      </div>
      </div>

      <div className="label-controls actions-row">
      <label>Dimensione celle:</label>
        <input
          type="number"
          value={cellSize}
          onChange={(e) => handleNumberChange(setCellSize, e.target.value, 32)}
          className="cell-input"
        />
      <label>Offset X:</label>
        <input
          type="number"
          value={offsetX}
          onChange={(e) => handleNumberChange(setOffsetX, e.target.value, 0)}
          className="cell-input"
        />
        <label>Offset Y:</label>
        <input
          type="number"
          value={offsetY}
          onChange={(e) => handleNumberChange(setOffsetY, e.target.value, 0)}
          className="cell-input"
        />
      </div>
      
    </div>
    
  );
};

export default MapControls;
