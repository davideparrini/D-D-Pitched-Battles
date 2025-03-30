// src/utils/resolveGridConfig.ts

type ResolveGridConfigParams = {
  useDetection: boolean;
  detectedCellSize: number | null;
  manualCellSize: number;
  detectedOffsetX: number;
  detectedOffsetY: number;
};

export const resolveGridConfig = ({
  useDetection,
  detectedCellSize,
  manualCellSize,
  detectedOffsetX,
  detectedOffsetY,
}: ResolveGridConfigParams) => {
  const cellSize = useDetection && detectedCellSize ? detectedCellSize : manualCellSize;
  const offsetX = useDetection ? detectedOffsetX : 0;
  const offsetY = useDetection ? detectedOffsetY : 0;

  return { cellSize, offsetX, offsetY };
};
