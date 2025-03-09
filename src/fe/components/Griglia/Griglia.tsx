import { useCallback, useMemo, useState } from "react";
import { Casella, CellConfig } from "../Casella/Casella";

// Configurazione della griglia intera
export interface GridConfig {
  rows: number;
  columns: number;
  cells: CellConfig[][]; // matrice di configurazioni: [riga][colonna]
}


interface GameGridProps {
    config: GridConfig;
  }
  
  
  export const GameGrid: React.FC<GameGridProps> = ({ config }) => {

    const [grid, setGrid] = useState(config.cells);
    const rows = useMemo(()=>config.rows,[]);
    const columns = useMemo(()=>config.columns,[]);

    const handleChangeOccupation = useCallback((row: number, col: number, newOccupied: boolean) => {
      const updatedBoard = [...config.cells]; // Creiamo una copia dell'array
      updatedBoard[row][col].occupied = newOccupied; // Modifica l'occupazione della cella
      setGrid(updatedBoard)
    },[config.cells]);


    return (
      <div className="grid">
        {config.cells.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <Casella key={colIndex} config={cell} onChangeOccupation={handleChangeOccupation} />
            ))}
          </div>
        ))}
      </div>
    );
  };