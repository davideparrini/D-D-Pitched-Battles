import { TerrainEnum, Terrain } from './terrain.ts';

export const possibleLabels = Object.values(TerrainEnum);

export const labelDifficultyMap: Record<string, number> = Object.fromEntries(
  Object.entries(Terrain),
);
