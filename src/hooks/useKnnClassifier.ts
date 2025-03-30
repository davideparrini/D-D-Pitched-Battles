// src/hooks/useKnnClassifier.ts

import { useCallback } from 'react';
import KNN from 'ml-knn';
import { LabeledCell, Size } from '../types/map';
import { TerrainEnum } from '../types/terrain.ts';
import { extractFeaturesFromImageData } from '../utils/extractFeatures';

export const useKnnClassifier = ({
  labeledCells,
  image,
  imageSize,
  cellSize,
  onResult,
}: {
  labeledCells: LabeledCell[];
  image: string | null;
  imageSize: Size | null;
  cellSize: number;
  onResult: (classifiedCells: LabeledCell[]) => void;
}) => {
  return useCallback(() => {
    if (!image || !imageSize || labeledCells.length === 0) return;

    const trainingFeatures = labeledCells.map((cell) => [...cell.color, 0]); // init texture=0
    const trainingLabels = labeledCells.map((cell) => cell.label);

    const knn = new KNN(trainingFeatures, trainingLabels);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const cols = Math.floor(imageSize.width / cellSize);
      const rows = Math.floor(imageSize.height / cellSize);
      const newCells: LabeledCell[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (labeledCells.some((c) => c.x === x && c.y === y)) continue;

          const data = ctx.getImageData(x * cellSize, y * cellSize, cellSize, cellSize).data;
          const { avgColor, texture } = extractFeaturesFromImageData(data);

          const [prediction] = knn.predict([[...avgColor, texture]]) as [string];

          const label = (Object.values(TerrainEnum) as string[]).includes(prediction)
            ? (prediction as TerrainEnum)
            : TerrainEnum.FUORI_MAPPA;

          newCells.push({ x, y, color: avgColor, label });
        }
      }

      onResult(newCells);
    };
  }, [image, imageSize, labeledCells, cellSize, onResult]);
};
