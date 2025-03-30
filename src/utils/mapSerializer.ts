// src/utils/mapSerializer.ts
import { LabeledCell } from '../types/map';
import { TokenType } from '../types/token';

export interface MapData {
  name?: string;
  description?: string;
  image: string; // base64
  cellSize: number;
  offsetX: number;
  offsetY: number;
  labeledCells: LabeledCell[];
  tokens: TokenType[];
  createdAt?: string;
}

type ImportMapCallbacks = {
  setImage: (img: string) => void;
  setImageSize: (size: { width: number; height: number }) => void;
  setLabeledCells: (cells: LabeledCell[]) => void;
  setTokens: (tokens: TokenType[]) => void;
  setCellSize: (size: number) => void;
  setOffsetX?: (offset: number) => void;
  setOffsetY?: (offset: number) => void;
};

// 📤 Esporta la mappa come JSON da scaricare
export const exportMapToJson = (data: MapData) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.name || 'mappa'}.json`;
  a.click();

  URL.revokeObjectURL(url);
};

// 📥 Importa una mappa da file JSON e aggiorna lo stato
export const importMapFromJson = async (file: File, callbacks: ImportMapCallbacks) => {
  const text = await file.text();
  const data: MapData = JSON.parse(text);

  callbacks.setImage(data.image);
  callbacks.setCellSize(data.cellSize);
  callbacks.setLabeledCells(data.labeledCells ?? []);
  callbacks.setTokens(data.tokens ?? []);

  if (callbacks.setOffsetX) {
    callbacks.setOffsetX(data.offsetX ?? 0);
  }
  if (callbacks.setOffsetY) {
    callbacks.setOffsetY(data.offsetY ?? 0);
  }

  const img = new Image();
  img.src = data.image;
  img.onload = () => {
    callbacks.setImageSize({ width: img.width, height: img.height });
  };
};
