"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { moveUp, moveDown, moveLeft, moveRight } from '@/utils/moveLogic';
import { TileData } from '@/types/TileData';
import { initializeBoard, spawnRandomTile, cleanUpTiles, isGameOver } from '@/utils/gameLogic';

interface GameState {
  tiles: TileData[];
  score: number;
  moves: number;
  undosLeft: number;
  undoHistory: GameHistory[];
  gameOver: boolean;
}

interface GameHistory {
  tiles: TileData[];
  score: number;
  moves: number;
}

export const useGame = () => {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [currentGameState, setCurrentGameState] = useState<GameState>();
  const [undoHistory, setUndoHistory] = useState<GameHistory[]>([]);
  const [undosLeft, setUndosLeft] = useState(0);
  const [maxUndos] = useState(2);
  const isMoving = useRef(false);

  const resumeGame = (gameState: GameState) => {
    setMoves(gameState.moves);
    setScore(gameState.score);
    setUndosLeft(gameState.undosLeft);
    setTiles(gameState.tiles);
    setGameOver(gameState.gameOver);
    setUndoHistory(gameState.undoHistory);
    const savedScore = localStorage.getItem('bestScore');
    if (savedScore) setBestScore(Number(savedScore));
  }

  const resetGame = () => {
    setCurrentGameState(undefined);
    localStorage.setItem("gameState", "")
    setMoves(0);
    setScore(0);
    setUndosLeft(maxUndos);
    setTiles(initializeBoard());
    setGameOver(false);
    setUndoHistory([]);
    const savedScore = localStorage.getItem('bestScore');
    if (savedScore) setBestScore(Number(savedScore));
  };

  const handleUndo = () => {
    if (undosLeft === 0 || undoHistory.length === 0) return;

    const lastState = undoHistory[undoHistory.length - 1];
    setTiles(lastState.tiles);
    setScore(lastState.score);
    setMoves(lastState.moves);
    setUndoHistory(prev => prev.slice(0, -1));
    setUndosLeft(u => u - 1);
    setGameOver(false);
  };

  const handleMove = useCallback((direction: string) => {
    if (isMoving.current) return;

    isMoving.current = true;
    const cleanedTiles = cleanUpTiles(tiles);
    let result: any;

    const previousState: GameHistory = {
      tiles: [...tiles],
      score,
      moves,
    };

    switch (direction) {
      case 'up': case 'w': result = moveUp(cleanedTiles); break;
      case 'down': case 's': result = moveDown(cleanedTiles); break;
      case 'left': case 'a': result = moveLeft(cleanedTiles); break;
      case 'right': case 'd': result = moveRight(cleanedTiles); break;
      default: return;
    }

    if (result.moved) {
      const hasNew128 = result.tiles.some((t: TileData) =>
        t.value === 128 && t.isMerged
      );
      if (hasNew128) {
        setUndosLeft(prev => Math.min(prev + 1, maxUndos));
      }

      setUndoHistory(prev => {
        const newHistory = [...prev, previousState];
        return newHistory.slice(-maxUndos); // Keep only last 2 moves
      });

      setMoves(m => m + 1)

      setScore(s => {
        const newScore = s + result.score;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('bestScore', newScore.toString());
        }
        return newScore;
      });

      // setTiles(result.tiles);
      const withNewTile = spawnRandomTile(result.tiles);
      setTiles(withNewTile);
      // Check game over after move
      if (isGameOver(withNewTile)) {
        setGameOver(true);
      }

      isMoving.current = false;
    } else {
      if (isGameOver(cleanedTiles)) {
        setGameOver(true);
      }
      isMoving.current = false;
    }

  }, [tiles, bestScore, moves, maxUndos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd'].includes(e.key)) return;
      e.preventDefault();
      handleMove(e.key.replace('Arrow', '').toLowerCase());
    };



    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const parsedObject = JSON.parse(savedState.toString()) as GameState;
      setCurrentGameState(parsedObject);
      resumeGame(parsedObject);

    }
    else {
      resetGame();
    }
  }, []);


  useEffect(() => {
    const currentState: GameState = {
      tiles: [...tiles],
      score,
      moves,
      undosLeft,
      undoHistory,
      gameOver
    };
    localStorage.setItem('gameState', JSON.stringify(currentState));
    setCurrentGameState(currentState);
  }, [tiles, score, moves, undoHistory, undosLeft, gameOver]);

  // useEffect(() => {
  //  console.dir(currentGameState)
  // }, [currentGameState]);


  return {
    tiles,
    score,
    bestScore,
    gameOver,
    moves,
    handleUndo,
    undosLeft,
    resetGame
  };
};