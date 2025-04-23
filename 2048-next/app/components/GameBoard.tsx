// components/GameBoard.tsx
import Tile from './Tile';
import ScoreBoard from './ScoreBoard';
import { TileData } from '@/types/TileData';
import { TILE_SIZE, TILE_GAP, GRID_PADDING } from '@/utils/constants';

const GameBoard = ({ tiles, score, bestScore }: { tiles: TileData[], score: number, bestScore: number }) => {
  return (

    <div
    className="relative bg-[#bbada0] rounded-lg"
    style={{
      width: TILE_SIZE * 4 + TILE_GAP * 5,
      height: TILE_SIZE * 4 + TILE_GAP * 5,
      padding: TILE_GAP,
    }}
  >
      {/* Background grid */}
      {[...Array(4)].map((_, row) =>
        [...Array(4)].map((_, col) => (
          <div
            key={`bg-${row}-${col}`}
            className="absolute rounded-lg"
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundColor: '#cdc1b4',
              top: row * (TILE_SIZE + TILE_GAP),
              left: col * (TILE_SIZE + TILE_GAP),
            }}
          />
        ))
      )}

      {tiles.map(tile => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </div>
  );
};

export default GameBoard;
