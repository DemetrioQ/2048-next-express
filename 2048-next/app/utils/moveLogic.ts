import { TileData } from '@/types/TileData';
import { buildGridFromTiles } from '@/utils/gridHelper';

let idCounter = 0;



const slideAndMerge = (tiles: TileData[]): TileData[] => {
  return tiles.reduce<TileData[]>((acc, tile) => {
    if (
      acc.length > 0 &&
      acc[acc.length - 1].value === tile.value &&
      !acc[acc.length - 1].isMerged
    ) {
      const last = acc.pop()!;
      acc.push({
        id: `merged-${idCounter++}`,
        value: last.value * 2,
        row: tile.row,
        col: tile.col,
        isMerged: true,
        mergedFrom: [last.id, tile.id],
      });
    } else {
      acc.push({ ...tile });
    }
    return acc;
  }, []);
};

const move = (
  tiles: TileData[],
  getLine: (grid: (TileData | null)[][], i: number) => TileData[],
  setLine: (result: TileData[], i: number) => TileData[]
): TileData[] => {
  const grid = buildGridFromTiles(tiles);
  const newTiles: TileData[] = [];

  for (let i = 0; i < 4; i++) {
    const line = getLine(grid, i);
    const moved = slideAndMerge(line);
    newTiles.push(...setLine(moved, i));
  }

  return newTiles;
};

export const moveLeft = (tiles: TileData[]) =>
  move(
    tiles,
    (g, r) => g[r].filter(t => t !== null).map(t => ({ ...t! })),
    (result, r) => result.map((t, c) => ({ ...t, row: r, col: c }))
  );

export const moveRight = (tiles: TileData[]) =>
  move(
    tiles,
    (g, r) => g[r].filter(t => t !== null).reverse().map(t => ({ ...t! })),
    (result, r) => result.map((t, i) => ({ ...t, row: r, col: 3 - i }))
  );

export const moveUp = (tiles: TileData[]) =>
  move(
    tiles,
    (g, c) => g.map(row => row[c]).filter(t => t !== null).map(t => ({ ...t! })),
    (result, c) => result.map((t, r) => ({ ...t, row: r, col: c }))
  );

export const moveDown = (tiles: TileData[]) =>
  move(
    tiles,
    (g, c) => g.map(row => row[c]).filter(t => t !== null).reverse().map(t => ({ ...t! })),
    (result, c) => result.map((t, i) => ({ ...t, row: 3 - i, col: c }))
  );