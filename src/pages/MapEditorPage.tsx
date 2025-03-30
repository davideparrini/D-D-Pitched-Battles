// src/pages/MapEditorPage.tsx
import React, { useState, useEffect } from 'react';
import GridOverlay from '../components/GridOverlay';
import MapControls from '../components/MapControls';
import Token from '../components/Token';
import { useImageUpload } from '../hooks/useImageUpload';
import { useKnnClassifier } from '../hooks/useKnnClassifier';
import { initializeFromSeeds } from '../utils/initializeFromSeeds';
import { LabeledCell } from '../types/map';
import { useMapLabeling } from '../hooks/useMapLabeling';
import { useTokenManager } from '../hooks/useTokenManager';
import '../css/MapUploader.css';
import { useGridDetection } from '../hooks/useGridDetection ';
import { TokenType } from '../types/token';

const MapEditorPage: React.FC = () => {
  const { image, imageSize, handleImageUpload } = useImageUpload();
  const { cellSize: detectedCellSize, offsetX, offsetY } = useGridDetection(image);

  const [manualCellSize, setManualCellSize] = useState<number>(32);
  const [useDetection, setUseDetection] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null);

  const cellSize = useDetection && detectedCellSize ? detectedCellSize : manualCellSize;

  const {
    labeledCells,
    setLabeledCells,
    selectedLabel,
    setSelectedLabel,
    showDifficulty,
    setShowDifficulty,
    darkMode,
    setDarkMode,
    handleLabel,
  } = useMapLabeling();

  const {
    tokens,
    selectedTokenType,
    setSelectedTokenType,
    placeToken,
    removeToken,
    moveToken,
  } = useTokenManager();

  const classifyRemainingCells = useKnnClassifier({
    labeledCells,
    image,
    imageSize,
    cellSize,
    onResult: (newCells: LabeledCell[]) => setLabeledCells((prev) => [...prev, ...newCells]),
  });

  useEffect(() => {
    const init = async () => {
      if (image && imageSize) {
        const initialCells = await initializeFromSeeds(image, imageSize, cellSize);
        setLabeledCells(initialCells);
      }
    };
    init();
  }, [image, imageSize, cellSize, setLabeledCells]);

  const handleReset = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutte le celle etichettate e le pedine?')) {
      setLabeledCells([]);
      setSelectedTokenType(null);
      tokens.forEach((token) => removeToken(token.id));
    }
  };

  const handleClickOnCell = (x: number, y: number, color: [number, number, number]) => {
    if (selectedTokenType) {
      placeToken(x, y, selectedTokenType);
      setSelectedTokenType(null); // deseleziona automaticamente
    } else {
      const token = tokens.find((t) => t.x === x && t.y === y);
      if (token) removeToken(token.id);
      handleLabel(x, y, color);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggingTokenId || !imageSize) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dropX = Math.floor((e.clientX - rect.left - offsetX) / cellSize);
    const dropY = Math.floor((e.clientY - rect.top - offsetY) / cellSize);
    moveToken(draggingTokenId, dropX, dropY);
    setDraggingTokenId(null);
  };

  const handleDragStart = (id: string) => {
    setDraggingTokenId(id);
    setIsMouseDown(false); // evita etichettature
  };
  

  return (
    <div
      className="map-uploader"
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {image && imageSize && (
        <>
          <MapControls
            selectedLabel={selectedLabel}
            setSelectedLabel={setSelectedLabel}
            showDifficulty={showDifficulty}
            setShowDifficulty={setShowDifficulty}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            manualCellSize={manualCellSize}
            setManualCellSize={setManualCellSize}
            classifyRemainingCells={classifyRemainingCells}
            onReset={handleReset}
            useDetection={useDetection}
            setUseDetection={setUseDetection}
            selectedTokenType={selectedTokenType}
            setSelectedTokenType={setSelectedTokenType}
          />

          <div
            style={{ position: 'relative', width: imageSize.width, height: imageSize.height }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <GridOverlay
              imageSrc={image}
              cellSize={cellSize}
              offsetX={offsetX}
              offsetY={offsetY}
              onCellLabeled={handleClickOnCell}
              labeledCells={labeledCells}
              showDifficulty={showDifficulty}
              isMouseDown={isMouseDown}
              darkMode={darkMode}
            />

            {tokens.map((token: TokenType) => (
              <Token
                key={token.id}
                {...token}
                cellSize={cellSize}
                draggable
                onDragStart={() => handleDragStart(token.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MapEditorPage;
