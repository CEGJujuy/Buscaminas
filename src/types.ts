export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export type GameStatus = 'playing' | 'won' | 'lost';
