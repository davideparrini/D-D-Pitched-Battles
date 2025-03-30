// src/components/GridOverlay.tsx
import React, { useRef } from 'react';
import { LabeledCell } from '../types/map';
import { useCanvasPainter } from '../hooks/useCanvasPainter';

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

  useCanvasPainter({
    canvasRef,
    imageSrc,
    cellSize,
    offsetX,
    offsetY,
    labeledCells,
    showDifficulty,
    darkMode,
  });

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown && e.type !== 'click') return;
    if (!onCellLabeled) return;

    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!canvas || !rect) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const eventX = e.clientX - rect.left;
    const eventY = e.clientY - rect.top;
    const cellX = Math.floor((eventX - offsetX) / cellSize);
    const cellY = Math.floor((eventY - offsetY) / cellSize);

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
