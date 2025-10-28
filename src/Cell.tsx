import { Cell as CellType } from './types';

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  gameStatus: 'playing' | 'won' | 'lost';
}

const Cell = ({ cell, onClick, onRightClick, gameStatus }: CellProps) => {
  const getCellContent = () => {
    if (cell.isFlagged && gameStatus === 'playing') {
      return '🚩';
    }
    if (cell.isFlagged && !cell.isRevealed) {
      return '🚩';
    }
    if (cell.isRevealed) {
      if (cell.isMine) {
        return '💣';
      }
      if (cell.adjacentMines > 0) {
        return cell.adjacentMines;
      }
    }
    return '';
  };

  const getCellColor = () => {
    if (!cell.isRevealed) return '#bdbdbd';
    if (cell.isMine) return '#f44336';
    return '#e0e0e0';
  };

  const getNumberColor = () => {
    const colors: Record<number, string> = {
      1: '#0000ff',
      2: '#008000',
      3: '#ff0000',
      4: '#000080',
      5: '#800000',
      6: '#008080',
      7: '#000000',
      8: '#808080',
    };
    return colors[cell.adjacentMines] || '#000000';
  };

  return (
    <button
      onClick={onClick}
      onContextMenu={onRightClick}
      disabled={gameStatus !== 'playing'}
      style={{
        width: '32px',
        height: '32px',
        border: cell.isRevealed ? '1px solid #999' : '2px outset #999',
        backgroundColor: getCellColor(),
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: gameStatus === 'playing' ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: typeof getCellContent() === 'number' ? getNumberColor() : '#000',
        padding: 0,
      }}
    >
      {getCellContent()}
    </button>
  );
};

export default Cell;
