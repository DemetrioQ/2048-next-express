"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { moveUp, moveDown, moveLeft, moveRight } from 'shared-2048-logic/utils/moveLogic';
import { initializeBoard, generateRandomTile, cleanUpTiles, isGameOver } from 'shared-2048-logic/utils/gameLogic';
import { GameHistory, TileMove, GameState, TileData, Direction } from 'shared-2048-logic/types';
import { generateSeed, getRng } from 'shared-2048-logic/utils/seededRandom';
import { rewardForMerge } from 'shared-2048-logic/engine/tileKinds';
import { useGameInput } from './useGameInput';




function findNewTile(before: TileData[], after: TileData[]): TileData | null {
  const beforeIds = new Set(before.map(tile => tile.id));
  return after.find(tile => !beforeIds.has(tile.id)) || null;
}

const loadBestScore = () => {
  const saved = localStorage.getItem('bestScore');
  return saved ? Number(saved) : 0;
}


export const useGame = () => {

  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [undoHistory, setUndoHistory] = useState<GameHistory[]>([]);
  const [undosLeft, setUndosLeft] = useState(0);
  const [maxUndos] = useState(2);
  const [moveHistory, setMoveHistory] = useState<TileMove[]>([]);
  const [seed, setSeed] = useState('');
  const [celebrated2048, setCelebrated2048] = useState(false);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const rngRef = useRef<(() => number) | null>(null);
  const rngCallCountRef = useRef(0);
  const isMoving = useRef(false);

  // Seek the deterministic rng to (seed, startCount) and store a draw function
  // in rngRef. Subsequent moves call rngRef.current directly with no per-move
  // re-seek, so cost is O(1) per move instead of O(count).
  const seekRng = (seed: string, startCount: number) => {
    const rng = getRng(seed);
    for (let i = 0; i < startCount; i++) rng();
    rngCallCountRef.current = startCount;
    rngRef.current = () => {
      rngCallCountRef.current++;
      return rng();
    };
  };


  const resumeGame = (gameState: GameState) => {
    setMoves(gameState.moves);
    setScore(gameState.score);
    setUndosLeft(gameState.undosLeft);
    setTiles(gameState.tiles);
    setGameOver(gameState.gameOver);
    setUndoHistory(gameState.undoHistory);
    setSeed(gameState.seed);
    seekRng(gameState.seed, gameState.rngCallCount);
    setCelebrated2048(!!gameState.celebrated2048);
    const savedScore = loadBestScore();
    if (savedScore) setBestScore(Number(savedScore));
  }

  const disableUndos = () => {
    setUndosLeft(0);
  };

  const resetGame = () => {
    localStorage.setItem("gameState", '{}');
    localStorage.removeItem('moveHistory');
    const [newSeed] = generateSeed();
    setSeed(newSeed);
    setMoves(0);
    setScore(0);
    setUndosLeft(maxUndos);
    seekRng(newSeed, 0);
    const { tiles, initialTiles } = initializeBoard(rngRef.current!);
    setTiles(tiles);
    setMoveHistory(initialTiles.map(tile => ({
      type: 'init',
      move: undefined,
      spawnedTile: tile
    } as TileMove)));

    setGameOver(false);
    setUndoHistory([]);
    setCelebrated2048(false);
    setShowWinOverlay(false);
    const savedScore = loadBestScore();
    if (savedScore) setBestScore(Number(savedScore));

  };

  const handleUndo = () => {
    if (undosLeft === 0 || undoHistory.length === 0) return;

    const lastState = undoHistory[undoHistory.length - 1];
    setTiles(lastState.tiles);
    setScore(lastState.score);
    setMoves(lastState.moves);
    seekRng(seed, lastState.rngCallCount);
    setUndoHistory(prev => prev.slice(0, -1));
    setMoveHistory(prev => prev.slice(0, -1));
    setUndosLeft(u => u - 1);
    setGameOver(false);
  };

  const handleMove = useCallback((direction: Direction) => {
    if (isMoving.current) return;
    if (gameOver) return;
    if (!rngRef.current) return;

    isMoving.current = true;
    const cleanedTiles = cleanUpTiles(tiles);
    let result: ReturnType<typeof moveUp>;

    const previousState: GameHistory = {
      tiles: [...tiles],
      score,
      moves,
      rngCallCount: rngCallCountRef.current,
    };

    switch (direction) {
      case 'up': result = moveUp(cleanedTiles); break;
      case 'down': result = moveDown(cleanedTiles); break;
      case 'left': result = moveLeft(cleanedTiles); break;
      case 'right': result = moveRight(cleanedTiles); break;
      default: return;
    }

    if (result.moved) {
      const earnedUndoBonus = result.tiles.some(
        (t: TileData) => t.isMerged && rewardForMerge(t)?.undoBonus
      );
      if (earnedUndoBonus) {
        setUndosLeft(prev => Math.min(prev + 1, maxUndos));
      }

      if (!celebrated2048 && result.tiles.some(t => t.isMerged && t.value === 2048)) {
        setCelebrated2048(true);
        setShowWinOverlay(true);
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

      const withNewTile = generateRandomTile(result.tiles, rngRef.current!);
      setTiles(withNewTile);
      // Check game over after move
      if (isGameOver(withNewTile)) {
        setGameOver(true);
      }

      const spawnedTile = findNewTile(result.tiles, withNewTile);
      if (spawnedTile) {
        setMoveHistory(prev => [
          ...prev,
          {
            type: 'move',
            move: direction,
            spawnedTile: spawnedTile
          }
        ]);
      }


      isMoving.current = false;
    } else {
      if (isGameOver(cleanedTiles)) {
        setGameOver(true);
      }
      isMoving.current = false;
    }

  }, [tiles, bestScore, moves, maxUndos, gameOver, seed]);


  // useEffect(() => {
  //   if (seed && !rngRef.current) {
  //     console.log("rng changed for seed: " + seed)
  //     rngRef.current = getRngWithCounter(seed, rngCallCountRef.current || 0);
  //     rngRef.current = getRng(seed);
  //   }
  // }, [seed]);

  // useEffect(() => {
  //   if (rngRef.current) {
  //     console.log("First 3 rngs:", rngRef.current(), rngRef.current(), rngRef.current());
  //   }
  // }, [rngRef.current]);

  useGameInput(handleMove);


  useEffect(() => {

    const savedHistory = localStorage.getItem('moveHistory');
    if (savedHistory && savedHistory.length > 0) {
      setMoveHistory(JSON.parse(savedHistory));
    }

    const savedState = localStorage.getItem('gameState');
    if (!savedState) {
      resetGame();
      return;
    }

    if (savedState) {
      const parsedObject = JSON.parse(savedState.toString()) as GameState;

      if (!parsedObject || !parsedObject.tiles || parsedObject.tiles.length == 0) {
        resetGame();
        return;
      }

      resumeGame(parsedObject);

    }

  }, []);




  useEffect(() => {
    const currentState: GameState = {
      tiles: [...tiles],
      score,
      moves,
      undosLeft,
      undoHistory,
      gameOver,
      seed,
      rngCallCount: rngCallCountRef.current,
      celebrated2048,
    };
    if (currentState.tiles.length > 0) localStorage.setItem('gameState', JSON.stringify(currentState));

  }, [tiles, score, moves, undoHistory, undosLeft, gameOver, celebrated2048]);


  useEffect(() => {
    if (moveHistory.length > 0) localStorage.setItem('moveHistory', JSON.stringify(moveHistory));
  }, [moveHistory]);


  const dismissWinOverlay = () => setShowWinOverlay(false);

  return {
    tiles,
    score,
    bestScore,
    gameOver,
    moves,
    moveHistory,
    seed,
    handleUndo,
    undosLeft,
    maxUndos,
    resetGame,
    disableUndos,
    showWinOverlay,
    dismissWinOverlay,
  };
};