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
}

const Token: React.FC<TokenProps> = ({ x, y, cellSize, type, draggable = false, onDragStart }) => {
  const emojiMap: Record<TokenEnum, string> = {
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

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
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
        cursor: draggable ? 'grab' : 'default',
      }}
    >
      {emojiMap[type]}
    </div>
  );
};

export default Token;
