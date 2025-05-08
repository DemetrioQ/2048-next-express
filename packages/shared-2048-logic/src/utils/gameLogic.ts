import { TileData } from "../types/TileData";
import { buildGridFromTiles } from "./gridHelper";

export const initializeBoard = (): { tiles: TileData[], initialTiles: { row: number, col: number, value: number }[] } => {
  // Create two initial tiles with value 2 in random positions
  const tiles: TileData[] = [];
  
  // First tile (random position)
  const row1 = Math.floor(Math.random() * 4);
  const col1 = Math.floor(Math.random() * 4);
  
  tiles.push({
    id: crypto.randomUUID(),
    value: 2,
    row: row1,
    col: col1,
    isNew: true
  });

  // Second tile (different position)
  let row2, col2;
  do {
    row2 = Math.floor(Math.random() * 4);
    col2 = Math.floor(Math.random() * 4);
  } while (row2 === row1 && col2 === col1); // Ensure different position

  tiles.push({
    id: crypto.randomUUID(),
    value: 2,
    row: row2,
    col: col2,
    isNew: true
  });

  return {
    tiles,
    initialTiles: [
      { row: row1, col: col1, value: 2 },
      { row: row2, col: col2, value: 2 }
    ]
  };
};

export const cleanUpTiles = (tiles: TileData[]): TileData[] => {
  return tiles.map(tile => ({
    ...tile,
    isNew: false,
    isMerged: false,
    previousRow: tile.row,
    previousCol: tile.col,
    mergedFrom: undefined
  }));
};

export const generateRandomTile = (existingTiles: TileData[]): TileData[] => {
  const emptyCells: { row: number, col: number }[] = [];

  // Find all empty cells
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!existingTiles.some(t => t.row === row && t.col === col)) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) return existingTiles; // No empty cells to spawn a tile

  // Pick random empty cell
  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  // 90% chance for 2, 10% chance for 4
  const value = Math.random() < 0.9 ? 2 : 4;

  // Return the updated tile list with the newly generated tile
  return [
    ...existingTiles,
    {
      id: crypto.randomUUID(),
      value,
      row,
      col,
      isNew: true
    }
  ];
};


export const isGameOver = (tiles: TileData[]): boolean => {
  // If there are empty spaces, game isn't over
  if (tiles.length < 16) return false;

  const grid = buildGridFromTiles(tiles);
  
  // Check all possible moves
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const current = grid[row][col];
      if (!current) continue;

      // Check adjacent tiles
      const directions = [
        { dr: 0, dc: 1 },  // right
        { dr: 1, dc: 0 },   // down
      ];

      for (const dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        
        if (newRow < 4 && newCol < 4) {
          const neighbor = grid[newRow][newCol];
          if (!neighbor || current.value === neighbor.value) {
            return false; // Move possible
          }
        }
      }
    }
  }

  return true; // No moves left
};