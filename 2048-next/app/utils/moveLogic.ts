import { TileData } from '@/types/TileData';
import { buildGridFromTiles } from '@/utils/gridHelper';

let idCounter = 0;


interface MoveResult {
  tiles: TileData[];
  score: number;
  moved: boolean;
}

const slideAndMerge = (line: TileData[]): { tiles: TileData[], score: number } => {
  let score = 0;
  const result = line.reduce<{ tiles: TileData[], score: number }>((acc, tile) => {
    if (acc.tiles.length > 0 && 
        acc.tiles[acc.tiles.length - 1].value === tile.value && 
        !acc.tiles[acc.tiles.length - 1].isMerged) {
      const last = acc.tiles.pop()!;
      const mergedValue = last.value * 2;
      const mergedTile = {
        ...tile,
        value: mergedValue,
        isMerged: true,
        mergedFrom: [last.id, tile.id],
        previousRow: tile.row,
        previousCol: tile.col
      };
      acc.tiles.push(mergedTile);
      acc.score += mergedValue;
    } else {
      acc.tiles.push({
        ...tile,
        previousRow: tile.row,
        previousCol: tile.col
      });
    }
    return acc;
  }, { tiles: [], score: 0 });

  return result;
};

const move = (
  tiles: TileData[],
  getLine: (grid: (TileData | null)[][], i: number) => TileData[],
  setLine: (result: TileData[], i: number) => TileData[]
): MoveResult => {
  const grid = buildGridFromTiles(tiles);
  const newTiles: TileData[] = [];
  let totalScore = 0;
  let moved = false;

  for (let i = 0; i < 4; i++) {
    const originalLine = getLine(grid, i);
    const { tiles: mergedLine, score } = slideAndMerge(originalLine);
    totalScore += score;

    const updatedLine = setLine(mergedLine, i).map((tile, pos) => {
      const newTile = {
        ...tile,
        row: tile.row,
        col: tile.col
      };
      
      // Check if position changed
      if (tile.previousRow !== undefined && tile.previousCol !== undefined) {
        if (tile.previousRow !== newTile.row || tile.previousCol !== newTile.col) {
          moved = true;
        }
      }
      return newTile;
    });

    // Check if any tiles were merged
    if (score > 0) {
      moved = true;
    }

    newTiles.push(...updatedLine);
  }

  return { 
    tiles: newTiles,
    score: totalScore,
    moved
  };
};

export const moveLeft = (tiles: TileData[]) =>
  move(
    tiles,
    (g, r) => g[r].filter(t => t !== null).map(t => ({ ...t! })),
    (result, r) => result.map((t, c) => ({
      ...t, 
      previousRow: t.row,
      previousCol: t.col, 
      row: r, 
      col: c
    }))
  );

export const moveRight = (tiles: TileData[]) =>
  move(
    tiles,
    (g, r) => g[r].filter(t => t !== null).reverse().map(t => ({ ...t! })),
    (result, r) => result.map((t, i) => ({ 
      ...t, 
      previousRow: t.row,
      previousCol: t.col, 
      row: r, 
      col: 3 - i }))
  );

export const moveUp = (tiles: TileData[]) =>
  move(
    tiles,
    (g, c) => g.map(row => row[c]).filter(t => t !== null).map(t => ({ ...t! })),
    (result, c) => result.map((t, r) => ({ 
      ...t, 
      previousRow: t.row,
      previousCol: t.col, 
      row: r, 
      col: c }))
  );

export const moveDown = (tiles: TileData[]) =>
  move(
    tiles,
    (g, c) => g.map(row => row[c]).filter(t => t !== null).reverse().map(t => ({ ...t! })),
    (result, c) => result.map((t, i) => ({ 
      ...t, 
      previousRow: t.row,
      previousCol: t.col, 
      row: 3 - i, 
      col: c }))
  );