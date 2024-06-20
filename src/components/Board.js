import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick, onCellRightClick, revealedCells, flaggedCells }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              value={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => onCellRightClick(e, rowIndex, colIndex)}
              revealed={revealedCells[rowIndex][colIndex]}
              flagged={flaggedCells[rowIndex][colIndex]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;