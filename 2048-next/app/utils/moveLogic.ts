import { TileData } from '@/types/TileData';
import { buildGridFromTiles } from '@/utils/gridHelper';

export interface MoveResult {
  tiles: TileData[];
  score: number;
  moved: boolean;
}

const processLine = (line: TileData[], direction: 'left' | 'right') => {
  let score = 0;
  const result: TileData[] = [];
  let prev: TileData | null = null;

  // Process in movement direction
  const orderedLine = direction === 'left' ? [...line] : [...line].reverse();

  for (const tile of orderedLine) {
    if (!prev) {
      prev = { ...tile };
      continue;
    }

    if (prev.value === tile.value && !prev.isMerged) {
      // Merge tiles
      const mergedValue = prev.value * 2;
      result.push({
        ...tile,
        value: mergedValue,
        isMerged: true,
        mergedFrom: [prev.id, tile.id]
      });
      score += mergedValue;
      prev = null;
    } else {
      result.push(prev);
      prev = { ...tile };
    }
  }
  if (prev) result.push(prev);

  // Fill empty spaces
  while (result.length < 4) {
    result.push({
      id: '',
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

export const moveTiles = (tiles: TileData[], direction: 'up' | 'down' | 'left' | 'right'): MoveResult => {
  const grid = buildGridFromTiles(tiles);
  const newTiles: TileData[] = [];
  let totalScore = 0;
  let moved = false;

  for (let i = 0; i < 4; i++) {
    const line = (direction === 'left' || direction === 'right')
      ? grid[i].filter(Boolean) as TileData[]
      : grid.map(row => row[i]).filter(Boolean) as TileData[];

    if (!line.length) continue;

    const { tiles: processed, score } = processLine(
      line,
      direction === 'left' || direction === 'up' ? 'left' : 'right'
    );

    totalScore += score;

    processed.forEach((tile, pos) => {
      if (tile.value === 0) return;

      const newRow = ['up', 'down'].includes(direction) ? pos : i;
      const newCol = ['left', 'right'].includes(direction) ? pos : i;

      if (tile.row !== newRow || tile.col !== newCol) moved = true;

      newTiles.push({
        ...tile,
        row: newRow,
        col: newCol,
        previousRow: tile.row,
        previousCol: tile.col
      });
    });
  }

  return {
    tiles: newTiles.filter(t => t.value > 0),
    score: totalScore,
    moved
  };
};

export const moveLeft = (tiles: TileData[]) => moveTiles(tiles, 'left');
export const moveRight = (tiles: TileData[]) => moveTiles(tiles, 'right');
export const moveUp = (tiles: TileData[]) => moveTiles(tiles, 'up');
export const moveDown = (tiles: TileData[]) => moveTiles(tiles, 'down');