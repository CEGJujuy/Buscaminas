import { useState, useEffect } from 'react';
import Board from './Board';
import { Difficulty, Cell, GameStatus } from './types';
import {
  DIFFICULTY_CONFIGS,
  createEmptyBoard,
  placeMines,
  calculateAdjacentMines,
  revealCell,
  checkWin,
  revealAllMines,
} from './gameLogic';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const config = DIFFICULTY_CONFIGS[difficulty];

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning && gameStatus === 'playing') {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, gameStatus]);

  const initializeGame = () => {
    const newBoard = createEmptyBoard(config.rows, config.cols);
    setBoard(newBoard);
    setGameStatus('playing');
    setIsFirstClick(true);
    setFlagCount(0);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || board[row][col].isFlagged) return;

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));

    if (isFirstClick) {
      placeMines(newBoard, config.mines, row, col);
      calculateAdjacentMines(newBoard);
      setIsFirstClick(false);
      setIsTimerRunning(true);
    }

    if (newBoard[row][col].isMine) {
      revealAllMines(newBoard);
      setBoard(newBoard);
      setGameStatus('lost');
      setIsTimerRunning(false);
      return;
    }

    revealCell(newBoard, row, col);

    if (checkWin(newBoard)) {
      setGameStatus('won');
      setIsTimerRunning(false);
    }

    setBoard(newBoard);
  };

  const handleCellRightClick = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || board[row][col].isRevealed) return;

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;

    setFlagCount((prev) => (newBoard[row][col].isFlagged ? prev + 1 : prev - 1));
    setBoard(newBoard);
  };

  const getStatusEmoji = () => {
    if (gameStatus === 'won') return '😎';
    if (gameStatus === 'lost') return '😵';
    return '🙂';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Buscaminas</h1>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficulty(diff)}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: difficulty === diff ? '#4caf50' : '#fff',
              color: difficulty === diff ? '#fff' : '#333',
              border: '2px solid #4caf50',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s',
            }}
          >
            {diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Media' : 'Difícil'}
          </button>
        ))}
      </div>

      <div
        style={{
          backgroundColor: '#bdbdbd',
          padding: '10px 20px',
          border: '3px solid #999',
          borderRadius: '4px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minWidth: '300px',
          gap: '20px',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d32f2f' }}>
          💣 {config.mines - flagCount}
        </div>
        <button
          onClick={initializeGame}
          style={{
            fontSize: '32px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
          }}
        >
          {getStatusEmoji()}
        </button>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
          ⏱️ {timer}
        </div>
      </div>

      <Board
        board={board}
        onCellClick={handleCellClick}
        onCellRightClick={handleCellRightClick}
        gameStatus={gameStatus}
      />

      {gameStatus === 'won' && (
        <div
          style={{
            marginTop: '20px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#4caf50',
          }}
        >
          ¡Felicidades! Has ganado en {timer} segundos
        </div>
      )}

      {gameStatus === 'lost' && (
        <div
          style={{
            marginTop: '20px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#d32f2f',
          }}
        >
          ¡Perdiste! Intenta de nuevo
        </div>
      )}

      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Cómo jugar</h3>
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Click izquierdo:</strong> Revelar celda
        </p>
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Click derecho:</strong> Colocar/quitar bandera
        </p>
        <p style={{ margin: '5px 0', color: '#666' }}>
          Los números indican cuántas minas hay adyacentes a esa celda
        </p>
      </div>
    </div>
  );
}

export default App;
