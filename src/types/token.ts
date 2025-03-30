export enum TokenEnum {
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
    id: string; // UUID
    x: number;
    y: number;
    type: TokenEnum;
  }
  