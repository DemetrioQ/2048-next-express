"use client";

import { useEffect, useState } from 'react';
import { moveUp, moveDown, moveLeft, moveRight } from '@/utils/moveLogic';
import { TileData } from '@/types/TileData';
import { spawnRandomTile, cleanUpTiles } from '@/utils/gameLogic';


export const useGame = () => {
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
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
    // Only access localStorage on the client-side
    if (typeof window !== 'undefined') {
      const savedBestScore = localStorage.getItem('bestScore');
      if (savedBestScore) {
        setBestScore(Number(savedBestScore));
      }
    }
  }, []);

  useEffect(() => {
    
    const handleKeyDown = (e: KeyboardEvent) => {

      const cleanedTiles = cleanUpTiles(tiles);
      let newTiles = tiles;
      let moved = false;
      let scoreIncrease = 0;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          console.log("moveUp")
          const upResult = moveUp(cleanedTiles);
          newTiles = upResult.tiles;
          scoreIncrease = upResult.score;
          moved = upResult.moved;
          break;
        case 'ArrowDown':
        case 's':
          console.log("moveDown")
          const downResult = moveDown(cleanedTiles);
          newTiles = downResult.tiles;
          scoreIncrease = downResult.score;
          moved = downResult.moved;
          break;
        case 'ArrowLeft':
        case 'a':
          console.log("moveLeft")
          const leftResult = moveLeft(cleanedTiles);
          newTiles = leftResult.tiles;
          scoreIncrease = leftResult.score;
          moved = leftResult.moved;
          break;
        case 'ArrowRight':
        case 'd':
          const rightResult = moveRight(cleanedTiles);
          newTiles = rightResult.tiles;
          scoreIncrease = rightResult.score;
          moved = rightResult.moved;
          break;
        default:
          return;
      }

      console.log(moved)
      if (moved) {
        const newScore = score + scoreIncrease;
        setScore(newScore);
        
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('bestScore', newScore.toString());
        }


        const withNewTile = spawnRandomTile(newTiles).map(t => ({
          ...t,
          previousCol: undefined,
          previousRow: undefined
        }));

        setTiles(withNewTile);


        
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles, bestScore]);

  return { tiles, setTiles, score, setScore, bestScore , setBestScore };
};
