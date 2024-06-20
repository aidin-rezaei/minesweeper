import React, { useState } from 'react';
import Board from './components/Board';
import './App.css';

const createBoard = (rows, cols, bombs) => {
  let board = Array(rows).fill().map(() => Array(cols).fill(0));

  let bombCount = 0;
  while (bombCount < bombs) {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * cols);
    if (board[row][col] === 0) {
      board[row][col] = '💣';
      bombCount++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === '💣') continue;
      let bombsAround = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
            if (board[r + i][c + j] === '💣') bombsAround++;
          }
        }
      }
      board[r][c] = bombsAround;
    }
  }
  return board;
};

const App = () => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [bombs, setBombs] = useState(20);
  const [board, setBoard] = useState(createBoard(rows, cols, bombs));
  const [revealedCells, setRevealedCells] = useState(Array(rows).fill().map(() => Array(cols).fill(false)));
  const [flaggedCells, setFlaggedCells] = useState(Array(rows).fill().map(() => Array(cols).fill(false)));
  const [gameStatus, setGameStatus] = useState('playing');

  const handleCellClick = (row, col) => {
    if (gameStatus !== 'playing' || revealedCells[row][col]) return;
    if (board[row][col] === '💣') {
      setGameStatus('lost');
      setRevealedCells(revealedCells.map(row => row.map(() => true)));
      return;
    }

    const newRevealedCells = [...revealedCells];
    const reveal = (r, c) => {
      if (r >= 0 && r < rows && c >= 0 && c < cols && !newRevealedCells[r][c] && !flaggedCells[r][c]) {
        newRevealedCells[r][c] = true;
        if (board[r][c] === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              reveal(r + i, c + j);
            }
          }
        }
      }
    };
    reveal(row, col);
    setRevealedCells(newRevealedCells);
    if (newRevealedCells.flat().filter(Boolean).length === rows * cols - bombs) {
      setGameStatus('won');
    }
  };

  const handleCellRightClick = (e, row, col) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || revealedCells[row][col]) return;
    const newFlaggedCells = [...flaggedCells];
    newFlaggedCells[row][col] = !newFlaggedCells[row][col];
    setFlaggedCells(newFlaggedCells);
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    if (bombs >= rows * cols) {
      alert("Number of bombs must be less than the total number of cells.");
      return;
    }
    const newBoard = createBoard(rows, cols, bombs);
    setBoard(newBoard);
    setRevealedCells(Array(rows).fill().map(() => Array(cols).fill(false)));
    setFlaggedCells(Array(rows).fill().map(() => Array(cols).fill(false)));
    setGameStatus('playing');
  };

  return (
    <div className="App">
      <h1>Minesweeper</h1>
      <form onSubmit={handleSettingsSubmit}>
        <label>
          Rows:
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            min="5"
            max="20"
            required
          />
        </label>
        <label>
          Columns:
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            min="5"
            max="20"
            required
          />
        </label>
        <label>
          Bombs:
          <input
            type="number"
            value={bombs}
            onChange={(e) => setBombs(Number(e.target.value))}
            min="1"
            max={rows * cols - 1}
            required
          />
        </label>
        <button type="submit">Start New Game</button>
      </form>
      <Board
        board={board}
        onCellClick={handleCellClick}
        onCellRightClick={handleCellRightClick}
        revealedCells={revealedCells}
        flaggedCells={flaggedCells}
      />
      {gameStatus !== 'playing' && <div className="message">{gameStatus === 'won' ? 'You Won!' : 'You Lost!'}</div>}
    </div>
  );
};

export default App;
