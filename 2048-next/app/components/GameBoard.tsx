import React from 'react';
import Tile from '@/components/Tile';
import { TileData } from '@/types/TileData';
import { AnimatePresence } from 'framer-motion';

const TILE_SIZE = 4.5 * 16;
const GAP = 8;

const GameBoard = ({ tiles }: { tiles: TileData[] }) => {
  return (
    <div
      className="relative"
      style={{
        width: TILE_SIZE * 4 + GAP * 3,
        height: TILE_SIZE * 4 + GAP * 3,
        backgroundColor: '#1c1c1c',
        padding: GAP,
        borderRadius: 16,
      }}
    >
      {/* Background cells */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <div
            key={`bg-${row}-${col}`}
            className="absolute bg-[#333] rounded"
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              top: row * (TILE_SIZE + GAP),
              left: col * (TILE_SIZE + GAP),
            }}
          />
        ))
      )}

      <AnimatePresence>
        {tiles.map(tile => (
          <Tile
            key={tile.id}
            {...tile}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GameBoard;