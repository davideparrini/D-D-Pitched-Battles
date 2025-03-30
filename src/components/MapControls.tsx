// src/components/MapControls.tsx
import React from 'react';
import { possibleLabels } from '../types/constants';
import { TokenEnum } from '../types/token';
import { TerrainEnum } from '../types/terrain';

interface MapControlsProps {
  selectedLabel: TerrainEnum;
  setSelectedLabel: (label: TerrainEnum) => void;
  showDifficulty: boolean;
  setShowDifficulty: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  manualCellSize: number;
  setManualCellSize: (val: number) => void;
  classifyRemainingCells: () => void;
  onReset: () => void;
  useDetection: boolean;
  setUseDetection: (val: boolean) => void;
  selectedTokenType: TokenEnum | null;
  setSelectedTokenType: (type: TokenEnum | null) => void;
}

const DEFAULT_CELL_SIZES = [16, 24, 32, 40, 48, 64];

const MapControls: React.FC<MapControlsProps> = ({
  selectedLabel,
  setSelectedLabel,
  showDifficulty,
  setShowDifficulty,
  darkMode,
  setDarkMode,
  manualCellSize,
  setManualCellSize,
  classifyRemainingCells,
  onReset,
  useDetection,
  setUseDetection,
  selectedTokenType,
  setSelectedTokenType,
}) => {
  return (
    <div className="map-controls">
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
            setSelectedTokenType(
              e.target.value === '' ? null : (e.target.value as TokenEnum)
            )
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
            checked={useDetection}
            onChange={(e) => setUseDetection(e.target.checked)}
          />
          Rileva automaticamente la griglia
        </label>

        {!useDetection && (
          <div className="cell-size-select">
            <label>Dimensione celle:</label>
            <select
              value={manualCellSize}
              onChange={(e) => setManualCellSize(parseInt(e.target.value))}
            >
              {DEFAULT_CELL_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
        )}

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

      <button className="classify-button" onClick={classifyRemainingCells}>
        Classifica celle rimanenti
      </button>

      <button
        className="classify-button"
        onClick={onReset}
        style={{ marginLeft: '0.5rem', backgroundColor: '#ef4444' }}
      >
        Reset celle
      </button>
    </div>
  );
};

export default MapControls;
