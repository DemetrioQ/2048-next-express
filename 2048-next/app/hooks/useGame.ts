"use client";

import { useEffect, useState } from 'react';
import { moveUp, moveDown, moveLeft, moveRight } from '@/utils/moveLogic';
import { TileData } from '@/types/TileData';
import { spawnRandomTile, cleanUpTiles } from '@/utils/gameLogic';

export const useGame = () => {
  const [tiles, setTiles] = useState<TileData[]>(() => [
    {
      id: crypto.randomUUID(),
      value: 2,
      row: 3,
      col: 0,
      isNew: true,
    },
    {
      id: crypto.randomUUID(),
      value: 2,
      row: 3,
      col: 3,
      isNew: true,
    },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const cleanedTiles = cleanUpTiles(tiles);
      let newTiles = tiles;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          newTiles = moveUp(cleanedTiles);
          break;
        case 'ArrowDown':
        case 's':
          newTiles = moveDown(cleanedTiles);
          break;
        case 'ArrowLeft':
        case 'a':
          newTiles = moveLeft(cleanedTiles);
          break;
        case 'ArrowRight':
        case 'd':
          newTiles = moveRight(cleanedTiles);
          break;
        default:
          return;
      }

      const changed = JSON.stringify(newTiles) !== JSON.stringify(cleanedTiles);
      console.log(changed);
      if (changed) {
        setTiles(newTiles); // Movement animation
        
        setTimeout(() => {
          const withNewTile = spawnRandomTile(newTiles);
          setTiles(withNewTile); //Add new tile animation
        }, 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles]);

  return { tiles, setTiles };
};
