// src/hooks/useCanvasPainter.ts
import { useEffect } from 'react';
import { LabeledCell } from '../types/map';
import { drawGrid, drawImage, drawLabels } from '../utils/canvasUtils';

interface UseCanvasPainterParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageSrc: string;
  cellSize: number;
  offsetX?: number;
  offsetY?: number;
  labeledCells?: LabeledCell[];
  showDifficulty?: boolean;
  darkMode?: boolean;
}

export const useCanvasPainter = ({
  canvasRef,
  imageSrc,
  cellSize,
  offsetX = 0,
  offsetY = 0,
  labeledCells = [],
  showDifficulty = true,
  darkMode = false,
}: UseCanvasPainterParams) => {
  useEffect(() => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = image.width;
      canvas.height = image.height;

      drawImage(ctx, image);
      drawGrid(ctx, image.width, image.height, cellSize, offsetX, offsetY, darkMode);
      drawLabels(ctx, labeledCells, cellSize, offsetX, offsetY, showDifficulty, darkMode);
    };
  }, [imageSrc, cellSize, offsetX, offsetY, labeledCells, showDifficulty, darkMode]);
};
