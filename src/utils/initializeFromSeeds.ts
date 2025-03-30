// src/utils/initializeFromSeeds.ts

import { RGBTuple, LabeledCell, Size } from '../types/map';
import { colorSeedHints, TerrainEnum } from '../types/terrain.ts';
import { extractFeaturesFromImageData } from './extractFeatures';

const colorDistance = (a: RGBTuple, b: RGBTuple): number => {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
};

export const initializeFromSeeds = async (
  imageSrc: string,
  imageSize: Size,
  cellSize: number,
  threshold: number = 50,
): Promise<LabeledCell[]> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const cols = Math.floor(imageSize.width / cellSize);
      const rows = Math.floor(imageSize.height / cellSize);

      const initialCells: LabeledCell[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const data = ctx.getImageData(x * cellSize, y * cellSize, cellSize, cellSize).data;
          const { avgColor, texture } = extractFeaturesFromImageData(data);

          for (const [terrainKey, seedColor] of Object.entries(colorSeedHints)) {
            const terrain = terrainKey as TerrainEnum;
            if (terrain === TerrainEnum.NO_TYPE) continue;

            const dist = colorDistance(avgColor, seedColor);

            const needsTexture = [
              TerrainEnum.ROCCIA,
              TerrainEnum.LAVICO,
              TerrainEnum.GHIACCIO,
              TerrainEnum.FUOCO,
            ];

            const isTextured = needsTexture.includes(terrain) ? texture > 1000 : true;

            if (dist < threshold && isTextured) {
              initialCells.push({
                x,
                y,
                color: avgColor,
                label: terrain,
              });
              break;
            }
          }
        }
      }

      resolve(initialCells);
    };
  });
};
