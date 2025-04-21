import { TileData } from '@/types/TileData';

export const buildGridFromTiles = (tiles: TileData[]): (TileData | null)[][] => {
  const grid: (TileData | null)[][] = Array.from({ length: 4 }, () =>
    Array(4).fill(null)
  );

  for (const tile of tiles) {
    grid[tile.row][tile.col] = tile;
  }

  return grid;
};

