export enum TokenEnum {
  REMOVE = '❌ Rimuovi pedina',
  GUERRIERO = 'GUERRIERO',
  MAGO = 'MAGO',
  LADRO = 'LADRO',
  GOBLIN = 'GOBLIN',
  ORCO = 'ORCO',
  SCHELETRO = 'SCHELETRO',
  DRAGO = 'DRAGO',
  CHIERICO = 'CHIERICO',
  CAVALIERE = 'CAVALIERE',
  FANTASMA = 'FANTASMA',
}

export interface TokenType {
  id: string;
  x: number;
  y: number;
  type: TokenEnum;
  stats?: CharacterStats;
  ownerId?: string; // viene assegnato in fase di setup
}

export interface CharacterStats {
  forza: number;
  destrezza: number;
  costituzione: number;
  intelligenza: number;
  saggezza: number;
  carisma: number;
}

export const defaultStats: CharacterStats = {
  forza: 10,
  destrezza: 10,
  costituzione: 10,
  intelligenza: 10,
  saggezza: 10,
  carisma: 10,
};
