import React from 'react';

const Cell = ({ value, onClick, onContextMenu, revealed, flagged }) => {
  return (
    <div
      className={`cell ${revealed ? 'revealed' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {revealed ? (value === '💣' ? '💣' : value === 0 ? '':value) : (flagged ? '🚩' : '')}
    </div>
  );
};

export default Cell;