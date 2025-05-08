import { TileData } from "../types/TileData";

export const buildGridFromTiles = (tiles: TileData[], size = 4): (TileData | null)[][] => {
  const grid: (TileData | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  for (const tile of tiles) {
    if (tile.row >= 0 && tile.row < size && tile.col >= 0 && tile.col < size) {
      grid[tile.row][tile.col] = tile;
    }
  }
  return grid;
};


