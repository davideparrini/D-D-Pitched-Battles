// import { useState } from 'react';
import './App.css';
import { GameGrid, GridConfig } from './components/Griglia/Griglia';
import { TerrainEnum } from './components/Casella/CasellaType';
// import { Casella, CellConfig } from './components/Casella/Casella';


// Funzione che crea una matrice 4x4 con il terreno specificato
// function createTerrainMatrix(terrain: TerrainEnum): TerrainEnum[][] {
//   const matrix: TerrainEnum[][] = [];
//   for (let i = 0; i < 4; i++) {
//     const row: TerrainEnum[] = [];
//     for (let j = 0; j < 4; j++) {
//       row.push(terrain);
//     }
//     matrix.push(row);
//   }
//   return matrix;
// }

interface Cell {
  occupied: boolean;
  terrainMatrix: TerrainEnum[][];
}

const create = ()=>{
  const cells: Cell[][] = [];
  
  // Parametri per il fiume lungo l'anti-diagonale
  const riverThreshold = 3; // se |globalRow + globalCol - 39| <= 1 -> acqua
  
  // Soglia per trasformare TERRA in SABBIA se vicino al fiume
  const sandThreshold = 2; // se 39 - (globalRow+globalCol) <= 2, usiamo SABBIA invece di TERRA
  
  // Costruiamo la griglia 10x10, dove ogni cella ha una mini-matrice 4x4
  for (let cellRow = 0; cellRow < 10; cellRow++) {
    const rowCells: Cell[] = [];
    for (let cellCol = 0; cellCol < 10; cellCol++) {
      const occupied = false;
      const terrainMatrix: TerrainEnum[][] = [];
      
      // Ogni cella è formata da 4x4 sotto-celle
      for (let subRow = 0; subRow < 4; subRow++) {
        const subRowArr: TerrainEnum[] = [];
        for (let subCol = 0; subCol < 4; subCol++) {
          // Calcola le coordinate globali nella griglia 40x40
          const globalRow = cellRow * 4 + subRow;
          const globalCol = cellCol * 4 + subCol;
          let terrain: TerrainEnum;
          const sum = globalRow + globalCol;
          
          // Se la sotto-cella è vicina alla linea anti-diagonale -> fiume
          if (Math.abs(sum - 42) <= riverThreshold) {
            // Se la cella è dalla parte opposta alla lava (globalRow > globalCol), usiamo acqua profonda
            terrain = (globalRow > globalCol)
              ? TerrainEnum.ACQUA_PROFONDA
              : TerrainEnum.ACQUA_BASSA;
          } else if (sum < 39) {
            // Area "sopra" l'anti-diagonale: gradiente
            if (globalCol < 16) {
              // In zona TERRA, ma se siamo molto vicini al fiume trasformiamo in SABBIA
              terrain = (37 - sum <= sandThreshold)
                ? TerrainEnum.SABBIA
                : TerrainEnum.TERRA;
            } else if (globalCol < 32) {
              terrain = TerrainEnum.ROCCIA;
            } else {
              terrain = TerrainEnum.LAVICO;
            }
          } else {
            // Area "sotto" l'anti-diagonale: prato con foresta più folta
            if (sum % 8 === 0) {
              terrain = TerrainEnum.FORESTA;
              // occupied = true;
            } else {
              terrain = TerrainEnum.PRATO;
            }
          }
          
          subRowArr.push(terrain);
        }
        terrainMatrix.push(subRowArr);
      }
      rowCells.push({ occupied, terrainMatrix });
    }
    cells.push(rowCells);
  }
  return cells;
}


const gridConfig: GridConfig = {
  rows: 10,
  columns: 10,
  // cells: [
  //   [
  //     { occupied: false, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.FORESTA], [TerrainEnum.SABBIA, TerrainEnum.ACQUA_BASSA, TerrainEnum.ROCCIA, TerrainEnum.TERRA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.ROCCIA]] },
  //     { occupied: true, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA], [TerrainEnum.GHIACCIO, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.ACQUA_BASSA, TerrainEnum.ROCCIA], [TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.SABBIA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.SABBIA], [TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.GHIACCIO], [TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.GHIACCIO, TerrainEnum.ROCCIA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.ROCCIA], [TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.ROCCIA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA], [TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA], [TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.ACQUA_BASSA]] }
  //   ],
  //   [
  //     { occupied: false, terrainMatrix: [[TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.TERRA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.ACQUA_BASSA, TerrainEnum.ROCCIA, TerrainEnum.FORESTA], [TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.GHIACCIO, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA], [TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.ROCCIA, TerrainEnum.TERRA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.ROCCIA], [TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.FORESTA], [TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.ACQUA_BASSA], [TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.GHIACCIO]] },
  //     { occupied: true, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.FORESTA], [TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.TERRA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA], [TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA], [TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.TERRA]] }
  //   ],
  //   [
  //     { occupied: false, terrainMatrix: [[TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.ROCCIA], [TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA], [TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.SABBIA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.ROCCIA, TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.SABBIA], [TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA], [TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.FORESTA], [TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.TERRA, TerrainEnum.ACQUA_BASSA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.TERRA, TerrainEnum.SABBIA], [TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.SABBIA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.TERRA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA], [TerrainEnum.ROCCIA, TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA], [TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.ROCCIA], [TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.ROCCIA]] },
  //     { occupied: true, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA], [TerrainEnum.ROCCIA, TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.FORESTA]] }
  //   ],
  //   [
  //     { occupied: false, terrainMatrix: [[TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.TERRA], [TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.TERRA], [TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.ROCCIA, TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.TERRA], [TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.FORESTA], [TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA, TerrainEnum.TERRA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.ROCCIA], [TerrainEnum.ROCCIA, TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.SABBIA], [TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.TERRA]] },
  //     { occupied: false, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.TERRA, TerrainEnum.FORESTA, TerrainEnum.SABBIA], [TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.ROCCIA], [TerrainEnum.FORESTA, TerrainEnum.SABBIA, TerrainEnum.ROCCIA, TerrainEnum.TERRA]] },
  //     { occupied: true, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.ROCCIA, TerrainEnum.TERRA, TerrainEnum.SABBIA, TerrainEnum.FORESTA], [TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.ROCCIA, TerrainEnum.SABBIA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA, TerrainEnum.TERRA]] }
  //   ]
  // ]
  cells: create()
};

// const cell : CellConfig =  {occupied: false, terrainMatrix: [[TerrainEnum.TERRA, TerrainEnum.ACQUA_BASSA, TerrainEnum.FORESTA, TerrainEnum.ROCCIA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.FORESTA], [TerrainEnum.SABBIA, TerrainEnum.ACQUA_BASSA, TerrainEnum.ROCCIA, TerrainEnum.TERRA], [TerrainEnum.SABBIA, TerrainEnum.FORESTA, TerrainEnum.TERRA, TerrainEnum.ROCCIA]] }

function App() {
    // const [count, setCount] = useState(0);

    return (
        <div className="App">
           <GameGrid config={gridConfig} />
        </div>
    );
}

export default App;
