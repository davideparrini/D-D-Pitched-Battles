// src/utils/canvasUtils.ts
import { LabeledCell } from '../types/map';
import { Terrain, TerrainEnum } from '../types/terrain';

export const drawImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
  ctx.drawImage(image, 0, 0);
};

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
  offsetX = 0,
  offsetY = 0,
  darkMode = false,
) => {
  ctx.strokeStyle = darkMode ? '#aaa' : '#333';
  ctx.lineWidth = 2;

  const cols = Math.floor((width - offsetX) / cellSize);
  for (let col = 0; col <= cols; col++) {
    const x = offsetX + col * cellSize;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  const rows = Math.floor((height - offsetY) / cellSize);
  for (let row = 0; row <= rows; row++) {
    const y = offsetY + row * cellSize;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

export const drawLabels = (
  ctx: CanvasRenderingContext2D,
  labeledCells: LabeledCell[],
  cellSize: number,
  offsetX: number,
  offsetY: number,
  showDifficulty: boolean,
  darkMode: boolean,
) => {
  labeledCells.forEach(({ x, y, label }) => {
    if (label === TerrainEnum.NO_TYPE) return;

    const px = offsetX + x * cellSize;
    const py = offsetY + y * cellSize;

    if (label === TerrainEnum.FUORI_MAPPA) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(px, py, cellSize, cellSize);
      return;
    }

    if (showDifficulty) {
      const difficulty = Terrain[label];
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(px, py, cellSize, cellSize);

      ctx.fillStyle = darkMode ? '#fff' : '#000';
      ctx.font = `${cellSize / 2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(difficulty.toString(), px + cellSize / 2, py + cellSize / 2);
    }
  });
};

export interface DetectedGrid {
  cellSize: number | null;
  hasGrid: boolean;
}

/**
 * Prova a rilevare automaticamente la griglia da un'immagine analizzando i pattern visivi
 */
// src/utils/canvasUtils.ts

export function detectGridFromImage(image: HTMLImageElement): {
  cellSize: number;
  hasGrid: boolean;
} {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { cellSize: 32, hasGrid: false };

  // Resize to speed up detection
  const scale = 0.2;
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { width, height, data } = imageData;

  // Convert to grayscale
  const grayscale = new Uint8Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
    grayscale[i / 4] = gray;
  }

  // Calculate vertical projection
  const vertical = new Float32Array(width);
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = 0; y < height; y++) {
      sum += grayscale[y * width + x];
    }
    vertical[x] = sum / height;
  }

  // Calculate horizontal projection
  const horizontal = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      sum += grayscale[y * width + x];
    }
    horizontal[y] = sum / width;
  }

  const detectSpacing = (arr: Float32Array): number | null => {
    const threshold = 10;
    const peaks: number[] = [];

    for (let i = 1; i < arr.length - 1; i++) {
      if (Math.abs(arr[i] - arr[i - 1]) > threshold && Math.abs(arr[i] - arr[i + 1]) > threshold) {
        peaks.push(i);
      }
    }

    if (peaks.length < 2) return null;

    const spacings = peaks.slice(1).map((p, i) => p - peaks[i]);
    const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
    return Math.round(avgSpacing / scale); // scale back to original size
  };

  const cellSizeX = detectSpacing(vertical);
  const cellSizeY = detectSpacing(horizontal);

  const cellSize =
    cellSizeX && cellSizeY ? Math.round((cellSizeX + cellSizeY) / 2) : cellSizeX || cellSizeY || 32;

  const hasGrid = !!(cellSizeX && cellSizeY);

  return { cellSize, hasGrid };
}
