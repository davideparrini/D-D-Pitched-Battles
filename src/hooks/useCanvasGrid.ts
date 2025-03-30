import { useState, useEffect } from 'react';
import { detectGridFromImage } from '../utils/canvasUtils';

export interface CanvasGridResult {
  cellSize: number;
  hasGrid: boolean;
}

/**
 * Hook che rileva automaticamente la griglia da un'immagine oppure imposta un fallback.
 * @param imageSrc Base64 dell'immagine
 * @param useDetection Se true prova a rilevare la griglia, altrimenti usa fallback
 * @param fallbackCellSize Dimensione di fallback se la griglia non viene rilevata
 */
export const useCanvasGrid = (
  imageSrc: string | null,
  useDetection: boolean,
  fallbackCellSize: number = 32,
): CanvasGridResult => {
  const [cellSize, setCellSize] = useState<number>(fallbackCellSize);
  const [hasGrid, setHasGrid] = useState<boolean>(false);

  useEffect(() => {
    if (!imageSrc) return;

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      if (useDetection) {
        const { cellSize: detected, hasGrid } = detectGridFromImage(image);
        setCellSize(detected ?? fallbackCellSize);
        setHasGrid(hasGrid);
      } else {
        setCellSize(fallbackCellSize);
        setHasGrid(false);
      }
    };
  }, [imageSrc, useDetection, fallbackCellSize]);

  return { cellSize, hasGrid };
};
