export type PlayerRole = 'PLAYER' | 'MASTER';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  tokenIds: string[];
}
