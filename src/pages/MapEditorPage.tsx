// src/pages/MapEditorPage.tsx
import React, { useEffect, useState } from 'react';
import GridOverlay from '../components/GridOverlay';
import MapControls from '../components/MapControls';
import Token from '../components/Token';
import { useImageUpload } from '../hooks/useImageUpload';
import { useKnnClassifier } from '../hooks/useKnnClassifier';
import { initializeFromSeeds } from '../utils/initializeFromSeeds';
import { useMapLabeling } from '../hooks/useMapLabeling';
import { useTokenManager } from '../hooks/useTokenManager';
import { exportMapToJson, importMapFromJson } from '../utils/mapSerializer';
import { TokenEnum, TokenType } from '../types/token';
import { LabeledCell } from '../types/map';
import '../css/MapEditorPage.css';

const MapEditorPage: React.FC = () => {
  const { image, setImage, imageSize, setImageSize, handleImageUpload } = useImageUpload();

  const [cellSize, setCellSize] = useState<number>(32);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null);
  const [mapName, setMapName] = useState('mappa-dnd');

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

  const { tokens, selectedTokenType, setSelectedTokenType, placeToken, setTokens, moveToken } =
    useTokenManager();

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
      setTokens([]);
      setSelectedTokenType(null);
    }
  };

  const handleClickOnCell = (x: number, y: number, color: [number, number, number]) => {
    if (selectedTokenType === TokenEnum.REMOVE) {
      setTokens((prev) => prev.filter((t) => t.x !== x || t.y !== y));
      return;
    }

    if (selectedTokenType) {
      placeToken(x, y, selectedTokenType);
      setSelectedTokenType(null);
      return;
    }

    handleLabel(x, y, color);
  };

  const handleDragStart = (id: string) => {
    setDraggingTokenId(id);
    setIsMouseDown(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!imageSize || !draggingTokenId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offsetX) / cellSize);
    const y = Math.floor((e.clientY - rect.top - offsetY) / cellSize);

    moveToken(draggingTokenId, x, y);
    setDraggingTokenId(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e);
  };

  const handleImport = async (file: File) => {
    await importMapFromJson(file, {
      setImage,
      setImageSize,
      setLabeledCells,
      setTokens,
      setCellSize,
    });
  };

  return (
    <div
      className="map-uploader"
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <div className="map-tools">
        <label>
          Carica immagine:
          <input type="file" accept="image/*" onChange={handleUpload} />
        </label>

        <label>
          Importa mappa (.json):
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
            }}
          />
        </label>

        <label>
          Nome mappa:
          <input type="text" value={mapName} onChange={(e) => setMapName(e.target.value)} />
        </label>

        <button
          onClick={() =>
            exportMapToJson({
              image: image!,
              cellSize,
              offsetX,
              offsetY,
              labeledCells,
              tokens,
              name: mapName || 'mappa-dnd',
              createdAt: new Date().toISOString(),
            })
          }
        >
          Esporta mappa
        </button>
      </div>

      {image && imageSize && (
        <>
          <MapControls
            selectedLabel={selectedLabel}
            setSelectedLabel={setSelectedLabel}
            showDifficulty={showDifficulty}
            setShowDifficulty={setShowDifficulty}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            classifyRemainingCells={classifyRemainingCells}
            onReset={handleReset}
            selectedTokenType={selectedTokenType}
            setSelectedTokenType={setSelectedTokenType}
            cellSize={cellSize}
            setCellSize={setCellSize}
            offsetX={offsetX}
            setOffsetX={setOffsetX}
            offsetY={offsetY}
            setOffsetY={setOffsetY}
          />

          <div
            style={{ position: 'relative', width: imageSize.width, height: imageSize.height }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
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
                draggable={selectedTokenType !== TokenEnum.REMOVE}
                isRemoveMode={selectedTokenType === TokenEnum.REMOVE}
                onRemove={() => setTokens((prev) => prev.filter((t) => t.id !== token.id))}
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
