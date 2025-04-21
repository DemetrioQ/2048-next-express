import { TileData } from "@/types/TileData";
import { buildGridFromTiles } from "./gridHelper";

export const createEmptyGrid = () => Array(4).fill(null).map(() => Array(4).fill(null));

export const spawnRandomTile = (tiles: TileData[]): TileData[] => {
  const emptyPositions = getEmptyPositions(tiles);
  if (emptyPositions.length === 0) return tiles;

  const spawnIndex = Math.floor(Math.random() * emptyPositions.length);
  const { row, col } = emptyPositions[spawnIndex];

  return [
    ...tiles,
    {
      id: crypto.randomUUID(),
      value: 2,
      row,
      col,
      isNew: true,
    },
  ];
};

export const cleanUpTiles = (tiles: TileData[]): TileData[] =>
  tiles.map(tile => ({
    ...tile,
    isMerged: false,
    isNew: false,
  }));

const getEmptyPositions = (tiles: TileData[]): { row: number; col: number }[] => {
  const grid = buildGridFromTiles(tiles);
  const empty: { row: number; col: number }[] = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!grid[row][col]) empty.push({ row, col });
    }
  }

  return empty;
};
