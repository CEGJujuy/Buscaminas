import { Cell, DifficultyConfig } from './types';

export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

export const createEmptyBoard = (rows: number, cols: number): Cell[][] => {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
    );
};

export const placeMines = (
  board: Cell[][],
  mineCount: number,
  firstClickRow: number,
  firstClickCol: number
): void => {
  const rows = board.length;
  const cols = board[0].length;
  let minesPlaced = 0;

  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    const isFirstClickCell = row === firstClickRow && col === firstClickCol;
    const isAdjacentToFirstClick =
      Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1;

    if (!board[row][col].isMine && !isFirstClickCell && !isAdjacentToFirstClick) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }
};

export const calculateAdjacentMines = (board: Cell[][]): void => {
  const rows = board.length;
  const cols = board[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = row + dr;
            const newCol = col + dc;
            if (
              newRow >= 0 &&
              newRow < rows &&
              newCol >= 0 &&
              newCol < cols &&
              board[newRow][newCol].isMine
            ) {
              count++;
            }
          }
        }
        board[row][col].adjacentMines = count;
      }
    }
  }
};

export const revealCell = (board: Cell[][], row: number, col: number): void => {
  const rows = board.length;
  const cols = board[0].length;

  if (
    row < 0 ||
    row >= rows ||
    col < 0 ||
    col >= cols ||
    board[row][col].isRevealed ||
    board[row][col].isFlagged
  ) {
    return;
  }

  board[row][col].isRevealed = true;

  if (board[row][col].adjacentMines === 0 && !board[row][col].isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) {
          revealCell(board, row + dr, col + dc);
        }
      }
    }
  }
};

export const checkWin = (board: Cell[][]): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
};

export const revealAllMines = (board: Cell[][]): void => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].isMine) {
        board[row][col].isRevealed = true;
      }
    }
  }
};
