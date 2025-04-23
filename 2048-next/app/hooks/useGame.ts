"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { moveUp, moveDown, moveLeft, moveRight } from '@/utils/moveLogic';
import { TileData } from '@/types/TileData';
import { initializeBoard, spawnRandomTile, cleanUpTiles, isGameOver } from '@/utils/gameLogic';

export const useGame = () => {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const isMoving = useRef(false);
  // if(!gameOver) setGameOver(true);
  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setScore(0);
    setTiles(initializeBoard());
    setGameOver(false);
    const savedScore = localStorage.getItem('bestScore');
    if (savedScore) setBestScore(Number(savedScore));
  };

  const handleMove = useCallback((direction: string) => {
    // if (isMoving.current) return;
    
    isMoving.current = true;
    const cleanedTiles = cleanUpTiles(tiles);
    let result: any;
    
    switch (direction) {
      case 'up': result = moveUp(cleanedTiles); break;
      case 'down': result = moveDown(cleanedTiles); break;
      case 'left': result = moveLeft(cleanedTiles); break;
      case 'right': result = moveRight(cleanedTiles); break;
      default: return;
    }

    if (result.moved) {
      setScore(s => {
        const newScore = s + result.score;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('bestScore', newScore.toString());
        }
        return newScore;
      });
      
      setTiles(result.tiles);
      setTimeout(() => {
        const withNewTile = spawnRandomTile(result.tiles);
        setTiles(withNewTile);
        
        // Check game over after move
        if (isGameOver(withNewTile)) {
          setGameOver(true);
        }

        isMoving.current = false;
      }, 0);
    } else {
      if (isGameOver(cleanedTiles)) {
        setGameOver(true);
      }
      isMoving.current = false;
    }
  }, [tiles, bestScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) return;
      e.preventDefault();
      handleMove(e.key.replace('Arrow', '').toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  return { 
    tiles, 
    score, 
    bestScore, 
    gameOver,
    resetGame
  };
};