"use client";

import { useEffect, useState } from 'react';
import {
  createEmptyGrid,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  addSpecificTile,
} from '@/lib/gameLogic';

export const useGame = () => {
  const [grid, setGrid] = useState<(number | null)[][]>(() => {
    let newGrid = createEmptyGrid();
    newGrid = addSpecificTile(newGrid, 2);
    newGrid = addSpecificTile(newGrid, 2);
    return newGrid;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newGrid = grid;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          newGrid = moveUp(grid);
          break;
        case 'ArrowDown':
        case 's':
          newGrid = moveDown(grid);
          break;
        case 'ArrowLeft':
        case 'a':
          newGrid = moveLeft(grid);
          break;
        case 'ArrowRight':
        case 'd':
          newGrid = moveRight(grid);
          break;
        default:
          return;
      }

      const changed = JSON.stringify(newGrid) !== JSON.stringify(grid);
      if (changed) {
        newGrid = addSpecificTile(newGrid, 2);
        setGrid(newGrid);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid]);

  return { grid };
};
