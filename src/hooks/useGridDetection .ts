// src/hooks/useGridDetection.ts
import { useEffect, useState } from 'react';



export const useGridDetection = (imageSrc: string | null)=> {
  const [cellSize, setCellSize] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (!imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = 'Anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(image, 0, 0);
      const { width, height } = image;
      const threshold = 50; // sensibilità al contrasto

      const imageData = ctx.getImageData(0, 0, width, height).data;

      const getGray = (x: number, y: number) => {
        const index = (y * width + x) * 4;
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];
        return Math.round((r + g + b) / 3);
      };

      const horizontalEdges: number[] = [];
      for (let y = 1; y < height; y++) {
        let contrast = 0;
        for (let x = 0; x < width; x++) {
          const curr = getGray(x, y);
          const prev = getGray(x, y - 1);
          contrast += Math.abs(curr - prev);
        }
        if (contrast / width > threshold) horizontalEdges.push(y);
      }

      const verticalEdges: number[] = [];
      for (let x = 1; x < width; x++) {
        let contrast = 0;
        for (let y = 0; y < height; y++) {
          const curr = getGray(x, y);
          const prev = getGray(x - 1, y);
          contrast += Math.abs(curr - prev);
        }
        if (contrast / height > threshold) verticalEdges.push(x);
      }

      const detectSpacing = (edges: number[]): number | null => {
        if (edges.length < 2) return null;
        const spacings = edges.slice(1).map((v, i) => v - edges[i]);
        const freq: Record<number, number> = {};
        spacings.forEach((sp) => (freq[sp] = (freq[sp] || 0) + 1));
        const mostCommon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
        return mostCommon ? parseInt(mostCommon[0]) : null;
      };

      const cellSizeX = detectSpacing(verticalEdges);
      const cellSizeY = detectSpacing(horizontalEdges);

      const cellSize = cellSizeX && cellSizeY ? Math.round((cellSizeX + cellSizeY) / 2) : null;
      const offsetX = verticalEdges[0] || 0;
      const offsetY = horizontalEdges[0] || 0;
      

      setCellSize(cellSize);
      setOffsetX(offsetX);
      setOffsetY(offsetY);
    };
  }, [imageSrc]);

  return  {
    cellSize,
    offsetX,
    setOffsetX,
    offsetY,
    setOffsetY,
  };
};
