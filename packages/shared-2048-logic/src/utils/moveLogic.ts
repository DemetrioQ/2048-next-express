import { Direction } from "../types/Direction";
import { MoveResult } from "../types/MoveResult";
import { TileData } from "../types/TileData";
import { buildGridFromTiles } from "./gridHelper";


const processLine = (line: TileData[], direction: Direction) => {
  let score = 0;
  const result: TileData[] = [];
  let prev: TileData | null = null;

  const orderedLine = direction === 'left' ? [...line] : [...line].reverse();

  for (const tile of orderedLine) {
    if (!prev) {
      prev = { ...tile, isMerged: false };
      continue;
    }

    if (prev.value === tile.value && !prev.isMerged && !tile.isMerged) {
      result.push({
        ...tile,
        value: prev.value * 2,
        isMerged: true,
        mergedFrom: [prev.id, tile.id]
      });
      score += prev.value * 2;
      prev = null;
    } else {
      result.push(prev);
      prev = { ...tile, isMerged: false };
    }
  }

  if (prev) result.push(prev);

  while (result.length < 4) {
    result.push({
      id: crypto.randomUUID(),
      value: 0,
      row: -1,
      col: -1
    });
  }

  return {
    tiles: direction === 'left' ? result : result.reverse(),
    score
  };
};


const moveTiles = (tiles: TileData[], direction: 'up' | 'down' | 'left' | 'right'): MoveResult => {
  const grid = buildGridFromTiles(tiles);
  const newTiles: TileData[] = [];
  let totalScore = 0;
  let moved = false;

  const isHorizontal = direction === 'left' || direction === 'right';
  const isForward = direction === 'left' || direction === 'up';

  for (let i = 0; i < 4; i++) {
    const line = isHorizontal
      ? grid[i].filter(Boolean) as TileData[]
      : grid.map(row => row[i]).filter(Boolean) as TileData[];

    if (!line.length) continue;

    const { tiles: processed, score } = processLine(line, isForward ? 'left' : 'right');
    totalScore += score;

    processed.forEach((tile, idx) => {
      if (tile.value === 0) return; // skip empty tiles

      const row = isHorizontal ? i : idx;
      const col = isHorizontal ? idx : i;

      moved ||= (tile.row !== row || tile.col !== col);

      newTiles.push({
        ...tile,
        row,
        col,
        previousRow: tile.row,
        previousCol: tile.col
      });
    });
  }

  return {
    tiles: newTiles,
    score: totalScore,
    moved
  };
};

export const moveLeft = (tiles: TileData[]) => moveTiles(tiles, 'left');
export const moveRight = (tiles: TileData[]) => moveTiles(tiles, 'right');
export const moveUp = (tiles: TileData[]) => moveTiles(tiles, 'up');
export const moveDown = (tiles: TileData[]) => moveTiles(tiles, 'down');