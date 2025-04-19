import React from 'react';


const GameBoard = ({ grid }: { grid: (number | null)[][] }) => {
    return (
      <div className="grid grid-cols-4 gap-2">
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded text-xl font-bold"
            >
               {tile !== null ? tile : ''}
            </div>
          ))
        )}
      </div>
    );
  };
  
export default GameBoard;
  
