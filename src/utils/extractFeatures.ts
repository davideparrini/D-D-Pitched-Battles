// src/utils/extractFeatures.ts

import { RGBTuple } from '../types/map';

export interface CellFeatures {
  avgColor: RGBTuple;
  texture: number;
}

const computeVariance = (values: number[]): number => {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
};

export const extractFeaturesFromImageData = (data: Uint8ClampedArray): CellFeatures => {
  const rVals: number[] = [];
  const gVals: number[] = [];
  const bVals: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    rVals.push(data[i]);
    gVals.push(data[i + 1]);
    bVals.push(data[i + 2]);
  }

  const pixelCount = rVals.length;
  const avgColor: RGBTuple = [
    Math.floor(rVals.reduce((a, b) => a + b, 0) / pixelCount),
    Math.floor(gVals.reduce((a, b) => a + b, 0) / pixelCount),
    Math.floor(bVals.reduce((a, b) => a + b, 0) / pixelCount),
  ];

  const texture = computeVariance(rVals) + computeVariance(gVals) + computeVariance(bVals);

  return { avgColor, texture };
};
