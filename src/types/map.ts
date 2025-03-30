import { TerrainEnum } from './terrain.ts';

export type RGBTuple = [number, number, number];

export interface Size {
  width: number;
  height: number;
}

export interface LabeledCell {
  x: number;
  y: number;
  color: RGBTuple;
  label: TerrainEnum;
}
