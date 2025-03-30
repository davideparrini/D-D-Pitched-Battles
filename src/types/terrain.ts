import { RGBTuple } from './map';

export enum TerrainEnum {
  NO_TYPE = 'NO_TYPE',
  TERRA = 'TERRA',
  FORESTA = 'FORESTA',
  ACQUA_BASSA = 'ACQUA_BASSA',
  ACQUA_PROFONDA = 'ACQUA_PROFONDA',
  ROCCIA = 'ROCCIA',
  SABBIA = 'SABBIA',
  GHIACCIO = 'GHIACCIO',
  FUOCO = 'FUOCO',
  LAVICO = 'LAVICO',
  MAGICO = 'MAGICO',
  PRATO = 'PRATO',
  FANGO = 'FANGO',
  NEVE = 'NEVE',
  FUORI_MAPPA = 'FUORI_MAPPA',
}

export type TerrainType = Record<TerrainEnum, number>;

export const Terrain: TerrainType = {
  [TerrainEnum.NO_TYPE]: -1,
  [TerrainEnum.TERRA]: 0,
  [TerrainEnum.FORESTA]: 1,
  [TerrainEnum.ACQUA_BASSA]: 0,
  [TerrainEnum.ACQUA_PROFONDA]: 1,
  [TerrainEnum.ROCCIA]: 2,
  [TerrainEnum.SABBIA]: 0,
  [TerrainEnum.GHIACCIO]: 2,
  [TerrainEnum.FUOCO]: 2,
  [TerrainEnum.LAVICO]: 3,
  [TerrainEnum.MAGICO]: 3,
  [TerrainEnum.PRATO]: 0,
  [TerrainEnum.FANGO]: 1,
  [TerrainEnum.NEVE]: 0,
  [TerrainEnum.FUORI_MAPPA]: -2,
};

export const colorSeedHints: Record<TerrainEnum, RGBTuple> = {
  [TerrainEnum.TERRA]: [160, 82, 45],
  [TerrainEnum.FORESTA]: [34, 139, 34],
  [TerrainEnum.ACQUA_BASSA]: [0, 191, 255],
  [TerrainEnum.ACQUA_PROFONDA]: [0, 0, 139],
  [TerrainEnum.ROCCIA]: [128, 128, 128],
  [TerrainEnum.SABBIA]: [255, 214, 102],
  [TerrainEnum.GHIACCIO]: [173, 216, 230],
  [TerrainEnum.FUOCO]: [255, 69, 0],
  [TerrainEnum.LAVICO]: [139, 0, 0],
  [TerrainEnum.MAGICO]: [128, 0, 128],
  [TerrainEnum.PRATO]: [124, 252, 0],
  [TerrainEnum.FANGO]: [139, 69, 19],
  [TerrainEnum.NEVE]: [255, 255, 255],
  [TerrainEnum.FUORI_MAPPA]: [0, 0, 0],
  [TerrainEnum.NO_TYPE]: [0, 0, 0],
};
