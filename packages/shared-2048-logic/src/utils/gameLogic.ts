import { TileMove } from "../types";
import { TileData } from "../types/TileData";
import { pickSpawn, tryMerge } from "../engine/tileKinds";
import { buildGridFromTiles } from "./gridHelper";
import { moveTiles } from "./moveLogic";
import { getRng } from "./seededRandom";

export const initializeBoard = (rng: () => number): { tiles: TileData[], initialTiles: { row: number, col: number, value: number }[] } => {
  // Create two initial tiles with value 2 in random positions
  const tiles: TileData[] = [];

  // let rngCount = 0;

  // First tile (random position)
  const row1 = Math.floor(rng() * 4);
  const col1 = Math.floor(rng() * 4);
  // rngCount += 2;

  tiles.push({
    id: generateTileId(row1, col1, 2, rng),
    value: 2,
    row: row1,
    col: col1,
    isNew: true
  });

  // Second tile (different position)
  let row2, col2;
  do {
    row2 = Math.floor(rng() * 4);
    col2 = Math.floor(rng() * 4);
    // rngCount += 2;
  } while (row2 === row1 && col2 === col1); // Ensure different position

  tiles.push({
    id: generateTileId(row2, col2, 2, rng),
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
    ],
  };
};

export const cleanUpTiles = (tiles: TileData[]): TileData[] => {
  return tiles.map(tile => ({
    ...tile,
    isNew: false,
    isMerged: false,
    mergedFrom: undefined
  }));
};

export const generateRandomTile = (existingTiles: TileData[], rng: () => number): TileData[] => {

  const occupied = new Set(existingTiles.map(t => `${t.row},${t.col}`));
  const emptyCells: { row: number, col: number }[] = [];

  // Always row-major order (0-3 rows, 0-3 cols)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!occupied.has(`${row},${col}`)) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) return existingTiles;

  const { row, col } = emptyCells[Math.floor(rng() * emptyCells.length)];
  const spawn = pickSpawn(rng);

  return [
    ...existingTiles,
    {
      id: generateTileId(row, col, spawn.value, rng),
      value: spawn.value,
      kind: spawn.kind,
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
          if (!neighbor || tryMerge(current, neighbor) || tryMerge(neighbor, current)) {
            return false; // Move possible
          }
        }
      }
    }
  }

  return true; // No moves left
};

export const verifyGame = (tileMoves: TileMove[], seed: string, submittedScore: number): boolean => {

  const rng = getRng(seed);

  let { tiles, initialTiles } = initializeBoard(rng);

  if (tileMoves.length < 2) return false;
  for (let i = 0; i < 2; i++) {
    const expected = initialTiles[i];
    const actual = tileMoves[i];
    if (
      !actual ||
      actual.type !== 'init' ||
      actual.spawnedTile.row !== expected.row ||
      actual.spawnedTile.col !== expected.col ||
      actual.spawnedTile.value !== expected.value
    ) {
      return false;
    }
  }


  //Loop the moves array and do every move
  let currentTiles = tiles;
  let score = 0;
  let moves = 0;

  for (const tileMove of tileMoves) {
    if (tileMove.type == 'init') continue;

    const direction = tileMove.move;

    if (!direction) {
      return false;
    }
    // Clean up previous state
    currentTiles = cleanUpTiles(currentTiles);


    //Move in the saved direction
    const moveResult = moveTiles(currentTiles, direction)

    if (moveResult.moved) {
      //spawn new tiles
      moves += 1;
      score += moveResult.score;

      const expectedTile = tileMove.spawnedTile;
      const withNewTile = generateRandomTile(moveResult.tiles, rng);

      // Find the actual spawned tile (the one not in moveResult.tiles)
      const actualSpawnedTile = withNewTile.find(
        tile => !moveResult.tiles.some(
          t => t.row === tile.row && t.col === tile.col && t.value === tile.value
        )
      );

      if (
        !actualSpawnedTile ||
        actualSpawnedTile.row !== expectedTile.row ||
        actualSpawnedTile.col !== expectedTile.col ||
        actualSpawnedTile.value !== expectedTile.value
      ) {
        return false;
      }


      currentTiles = withNewTile

    }

  }

  if (score != submittedScore) return false;

  return true;
}



function generateTileId(row: number, col: number, value: number, rng: () => number) {
  return `t-${row}-${col}-${value}-${Math.floor(rng() * 1_000_000_000)}`;
}