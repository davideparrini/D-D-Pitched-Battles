// src/hooks/useMapLabeling.ts
import { useState } from 'react';
import { LabeledCell } from '../types/map';
import { TerrainEnum } from '../types/terrain.ts';

export const useMapLabeling = () => {
  const [labeledCells, setLabeledCells] = useState<LabeledCell[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<TerrainEnum>(TerrainEnum.TERRA);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLabel = (x: number, y: number, color: [number, number, number]) => {
    setLabeledCells((prev) => {
      const updated = prev.filter((cell) => cell.x !== x || cell.y !== y);
      return [...updated, { x, y, color, label: selectedLabel }];
    });
  };

  return {
    labeledCells,
    setLabeledCells,
    selectedLabel,
    setSelectedLabel,
    showDifficulty,
    setShowDifficulty,
    darkMode,
    setDarkMode,
    handleLabel,
  };
};
