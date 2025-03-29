import React, {  useMemo, useState } from 'react';
import { Terrain, TerrainEnum } from './CasellaType';
import './Casella.css'

// 1. Modifica dell'interfaccia CellConfig per supportare una matrice di terreni
export interface CellConfig {
  occupied: boolean;
  terrainMatrix: TerrainEnum[][];  // Matrice 4x4 di terreni
}

// 2. Componente Casella
interface CasellaProps {
  config: CellConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeOccupation: any;
}

export const Casella: React.FC<CasellaProps> = ({ config, onChangeOccupation }) => {
  // Imposta lo stato se la casella è occupata
  const [isPlayerThere, setIsPlayerThere] = useState(config.occupied);

  // Calcola la difficoltà massima della casella in base alla matrice di terreni
  const maxDifficulty = useMemo(() => {
    return Math.max(
      ...config.terrainMatrix.flatMap(row =>
        row.map(terrain => Terrain[terrain].difficulty)
      )
    );
  }, [config.terrainMatrix]);

  const handleClick = (row: number, col: number) => {
    const newOccupationStatus = !isPlayerThere;
    setIsPlayerThere(newOccupationStatus);
    onChangeOccupation(row, col, newOccupationStatus);
  };

  return (
    <div className='casella' onClick={()=>handleClick(4,4)} title={`Difficoltà: ${maxDifficulty} ${config.occupied ? ' - Occupata' : ''}`}>
      <div className="terrain-grid">
        {config.terrainMatrix.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((terrain, colIndex) => {
              const terrainColor = Terrain[terrain].color;
              return (
                <div
                  key={colIndex}
                  className="tile"
                  style={{
                    backgroundColor: terrainColor,
                  }}
                />
              );
            })}
            
          </div>
        ))}
      </div>
      {isPlayerThere && <div className="player-indicator">
        <span className="player-text">P</span>
      </div>}
    </div>
  );
};
