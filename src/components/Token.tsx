// src/components/Token.tsx
import React from 'react';
import { TokenEnum } from '../types/token';

interface TokenProps {
  x: number;
  y: number;
  cellSize: number;
  type: TokenEnum;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  isRemoveMode?: boolean;
  onRemove?: () => void;
}

const Token: React.FC<TokenProps> = ({
  x,
  y,
  cellSize,
  type,
  draggable = false,
  onDragStart,
  isRemoveMode,
  onRemove,
}) => {
  const emojiMap: Partial<Record<TokenEnum, string>> = {
    [TokenEnum.GUERRIERO]: '🛡️',
    [TokenEnum.MAGO]: '🧙',
    [TokenEnum.LADRO]: '🗡️',
    [TokenEnum.GOBLIN]: '👺',
    [TokenEnum.ORCO]: '👹',
    [TokenEnum.SCHELETRO]: '💀',
    [TokenEnum.DRAGO]: '🐉',
    [TokenEnum.CHIERICO]: '✝️',
    [TokenEnum.CAVALIERE]: '🏇',
    [TokenEnum.FANTASMA]: '👻',
  };

  const handleClick = () => {
    if (isRemoveMode && onRemove) {
      onRemove();
    }
  };

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: y * cellSize,
        left: x * cellSize,
        width: cellSize,
        height: cellSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: cellSize * 0.6,
        pointerEvents: 'auto',
        userSelect: 'none',
        cursor: isRemoveMode ? 'pointer' : draggable ? 'grab' : 'default',
        boxShadow: isRemoveMode ? '0 0 8px rgba(255, 0, 0, 0.5)' : 'none',
      }}
    >
      {emojiMap[type]}
    </div>
  );
};

export default Token;
