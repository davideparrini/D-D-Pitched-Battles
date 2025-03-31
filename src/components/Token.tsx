// src/components/Token.tsx
import React from 'react';
import { TokenEnum } from '../types/token';
import '../css/Token.css';

interface TokenProps {
  x: number;
  y: number;
  cellSize: number;
  type: TokenEnum;
  draggable?: boolean;
  label?: string;
  playerName?: string;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  isRemoveMode?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

const Token: React.FC<TokenProps> = ({
  x,
  y,
  cellSize,
  type,
  draggable = false,
  label,
  playerName,
  onDragStart,
  isRemoveMode,
  onRemove,
  onClick,
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
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="token-wrapper"
      style={{
        top: y * cellSize,
        left: x * cellSize,
        width: cellSize,
        height: cellSize,
        fontSize: cellSize * 0.6,
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={handleClick}
    >
      <div
        className={`token-emoji ${isRemoveMode ? 'removable' : ''}`}
        style={{ cursor: isRemoveMode ? 'pointer' : draggable ? 'grab' : 'default' }}
      >
        {emojiMap[type]}
      </div>
      {label && (
        <div className="token-label">
          <strong>{label}</strong>
          {playerName && <div className="token-player">({playerName})</div>}
        </div>
      )}
    </div>
  );
};

export default Token;
