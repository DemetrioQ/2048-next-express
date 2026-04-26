import { describe, it, expect } from 'vitest';
import { initializeBoard, generateRandomTile, cleanUpTiles, verifyGame } from '../utils/gameLogic';
import { moveTiles } from '../utils/moveLogic';
import { getRng } from '../utils/seededRandom';
import { TileMove, Direction, TileData, GameHistory } from '../types';

// Plays a deterministic game to produce a (moveHistory, finalScore) pair that
// verifyGame should accept. The directions list is best-effort: moves that
// don't move the board are skipped, like the real client does.
function playGame(seed: string, directions: Direction[]) {
  const rng = getRng(seed);
  const { tiles: initial, initialTiles } = initializeBoard(rng);

  const moveHistory: TileMove[] = initialTiles.map(t => ({
    type: 'init',
    move: undefined,
    spawnedTile: t,
  } as TileMove));

  let currentTiles = initial;
  let score = 0;

  for (const dir of directions) {
    currentTiles = cleanUpTiles(currentTiles);
    const result = moveTiles(currentTiles, dir);
    if (!result.moved) continue;

    score += result.score;
    const before = result.tiles;
    currentTiles = generateRandomTile(before, rng);

    const beforeIds = new Set(before.map(b => b.id));
    const spawned = currentTiles.find(t => !beforeIds.has(t.id));
    if (!spawned) continue;

    moveHistory.push({
      type: 'move',
      move: dir,
      spawnedTile: { row: spawned.row, col: spawned.col, value: spawned.value },
    });
  }

  return { moveHistory, score };
}

describe('verifyGame', () => {
  const seed = 'test-seed-2048-fixed';
  const directions: Direction[] = ['left', 'down', 'right', 'up', 'left', 'down', 'left', 'right'];

  it('accepts a faithfully replayed game', () => {
    const { moveHistory, score } = playGame(seed, directions);
    expect(verifyGame(moveHistory, seed, score)).toBe(true);
  });

  it('rejects a tampered score', () => {
    const { moveHistory, score } = playGame(seed, directions);
    expect(verifyGame(moveHistory, seed, score + 4)).toBe(false);
  });

  it('rejects a tampered spawned-tile position', () => {
    const { moveHistory, score } = playGame(seed, directions);
    // Find the first 'move' entry and shift its spawned tile to a likely-wrong cell
    const tampered = moveHistory.map(m => ({ ...m, spawnedTile: { ...m.spawnedTile } }));
    const firstMoveIdx = tampered.findIndex(m => m.type === 'move');
    expect(firstMoveIdx).toBeGreaterThan(-1);
    const orig = tampered[firstMoveIdx].spawnedTile;
    tampered[firstMoveIdx].spawnedTile = {
      ...orig,
      row: (orig.row + 1) % 4,
      col: (orig.col + 1) % 4,
    };
    expect(verifyGame(tampered, seed, score)).toBe(false);
  });

  it('rejects a different seed', () => {
    const { moveHistory, score } = playGame(seed, directions);
    expect(verifyGame(moveHistory, 'different-seed', score)).toBe(false);
  });

  // Regression: handleUndo must restore rngCallCount, otherwise post-undo plays
  // diverge from the server replay and verifyGame rejects valid games.
  it('accepts a game where the player undid a move and continued', () => {
    const undoSeed = 'undo-fix-regression-seed';

    // Mirrors the client's getRngWithCounter: rebuild rng + fast-forward each move.
    const moveSpawn = (count: number, tiles: TileData[]) => {
      const rng = getRng(undoSeed);
      for (let i = 0; i < count; i++) rng();
      let c = count;
      const draw = () => { c++; return rng(); };
      const newTiles = generateRandomTile(tiles, draw);
      return { newTiles, newCount: c };
    };

    // Init draws use a fresh rng so we can capture the post-init counter.
    const initRng = getRng(undoSeed);
    let count = 0;
    const initDraw = () => { count++; return initRng(); };
    const { tiles: initial, initialTiles } = initializeBoard(initDraw);

    const moveHistory: TileMove[] = initialTiles.map(t => ({
      type: 'init',
      move: undefined,
      spawnedTile: t,
    } as TileMove));

    let currentTiles = initial;
    let score = 0;
    const undoStack: GameHistory[] = [];

    const doMove = (dir: Direction): boolean => {
      const snapshot: GameHistory = {
        tiles: [...currentTiles],
        score,
        moves: 0,
        rngCallCount: count,
      };
      const cleaned = cleanUpTiles(currentTiles);
      const result = moveTiles(cleaned, dir);
      if (!result.moved) return false;

      const before = result.tiles;
      const { newTiles, newCount } = moveSpawn(count, before);
      currentTiles = newTiles;
      count = newCount;
      score += result.score;
      undoStack.push(snapshot);

      const beforeIds = new Set(before.map(b => b.id));
      const spawned = newTiles.find(t => !beforeIds.has(t.id))!;
      moveHistory.push({
        type: 'move',
        move: dir,
        spawnedTile: { row: spawned.row, col: spawned.col, value: spawned.value },
      });
      return true;
    };

    const undo = () => {
      const last = undoStack.pop();
      if (!last) return;
      currentTiles = last.tiles;
      score = last.score;
      count = last.rngCallCount;
      moveHistory.pop();
    };

    doMove('left');
    doMove('down');
    doMove('right');
    undo();
    doMove('up');
    doMove('left');

    expect(verifyGame(moveHistory, undoSeed, score)).toBe(true);
  });
});
