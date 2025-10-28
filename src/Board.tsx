import { Cell as CellType, GameStatus } from './types';
import Cell from './Cell';

interface BoardProps {
  board: CellType[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number, e: React.MouseEvent) => void;
  gameStatus: GameStatus;
}

const Board = ({ board, onCellClick, onCellRightClick, gameStatus }: BoardProps) => {
  return (
    <div
      style={{
        display: 'inline-block',
        backgroundColor: '#bdbdbd',
        padding: '10px',
        border: '3px solid #999',
        borderRadius: '4px',
      }}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: '2px' }}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onRightClick={(e) => onCellRightClick(rowIndex, colIndex, e)}
              gameStatus={gameStatus}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
