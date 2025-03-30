// src/hooks/useTokenManager.ts
import { useState } from 'react';
import { TokenType, TokenEnum } from '../types/token';
import { v4 as uuidv4 } from 'uuid';

export const useTokenManager = () => {
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [selectedTokenType, setSelectedTokenType] = useState<TokenEnum | null>(null);

  const placeToken = (x: number, y: number, type: TokenEnum) => {
    setTokens((prev) => [
      ...prev.filter((t) => t.x !== x || t.y !== y), // sovrascrive se già presente
      { id: uuidv4(), x, y, type },
    ]);
  };

  const moveToken = (id: string, newX: number, newY: number) => {
    setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, x: newX, y: newY } : t)));
  };

  const removeToken = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tokens,
    setTokens,
    selectedTokenType,
    setSelectedTokenType,
    placeToken,
    moveToken,
    removeToken,
  };
};
