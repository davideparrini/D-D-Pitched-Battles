// src/components/GridOverlay.tsx
import React, { useRef, useEffect } from 'react';
import { LabeledCell } from '../types/map';
import { TerrainEnum, Terrain } from '../types/terrain.ts';

interface GridOverlayProps {
  imageSrc: string;
  cellSize: number;
  offsetX?: number;
  offsetY?: number;
  onCellLabeled?: (x: number, y: number, color: [number, number, number]) => void;
  labeledCells?: LabeledCell[];
  showDifficulty?: boolean;
  isMouseDown?: boolean;
  darkMode?: boolean;
}

const GridOverlay: React.FC<GridOverlayProps> = ({
  imageSrc,
  cellSize,
  offsetX = 0,
  offsetY = 0,
  onCellLabeled,
  labeledCells = [],
  showDifficulty = true,
  isMouseDown = false,
  darkMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // ctx.imageSmoothingEnabled = false;
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      // Griglia overlay
      ctx.strokeStyle = darkMode ? '#aaa' : '#333';
      ctx.lineWidth = 2;

      // Colonne
      const cols = Math.floor((image.width - offsetX) / cellSize);
      for (let col = 0; col <= cols; col++) {
        const x = offsetX + col * cellSize;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, image.height);
        ctx.stroke();
      }

      // Righe (✅ aggiornata)
      const rows = Math.floor((image.height - offsetY) / cellSize);
      for (let row = 0; row <= rows; row++) {
        const y = offsetY + row * cellSize;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(image.width, y);
        ctx.stroke();
      }

      // Celle etichettate
      labeledCells.forEach(({ x, y, label }) => {
        const px = offsetX + x * cellSize;
        const py = offsetY + y * cellSize;
        const difficulty = Terrain[label];

        if (label === TerrainEnum.NO_TYPE) return;

        if (label === TerrainEnum.FUORI_MAPPA) {
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(px, py, cellSize, cellSize);
          return;
        }

        if (showDifficulty) {
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fillRect(px, py, cellSize, cellSize);

          ctx.fillStyle = darkMode ? '#fff' : '#000';
          ctx.font = `${cellSize / 2}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            difficulty.toString(),
            px + cellSize / 2,
            py + cellSize / 2
          );
        }
      });
    };
  }, [imageSrc, cellSize, offsetX, offsetY, labeledCells, showDifficulty, darkMode]);

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown && e.type !== 'click') return;
    if (!onCellLabeled) return;

    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!canvas || !rect) return;

    const eventX = e.clientX - rect.left;
    const eventY = e.clientY - rect.top;

    const cellX = Math.floor((eventX - offsetX) / cellSize);
    const cellY = Math.floor((eventY - offsetY) / cellSize);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const px = offsetX + cellX * cellSize;
    const py = offsetY + cellY * cellSize;

    const imageData = ctx.getImageData(px, py, cellSize, cellSize).data;
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
    }

    const pixelCount = imageData.length / 4;
    const avgColor: [number, number, number] = [
      Math.floor(r / pixelCount),
      Math.floor(g / pixelCount),
      Math.floor(b / pixelCount),
    ];

    onCellLabeled(cellX, cellY, avgColor);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      style={{ cursor: 'crosshair' }}
    />
  );
};

export default GridOverlay;
