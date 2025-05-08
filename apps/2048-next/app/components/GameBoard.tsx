import { TileData } from 'shared-2048-logic/types';
import Tile from './Tile';
import { TILE_GAP, TILE_SIZE, GRID_PADDING } from 'shared-2048-logic/utils/constants';

interface GameBoardProps {
    tiles: TileData[];
    score: number;
    bestScore: number;
    gameOver: boolean;
    onReset: () => void;
}

const GameBoard = ({ tiles, score, bestScore, gameOver, onReset }: GameBoardProps) => {
    const gridSize = TILE_SIZE * 4 + TILE_GAP * 3 + GRID_PADDING * 2;
    return (
        <div
            className="relative bg-[#bbada0] rounded-lg"
            style={{
                width: gridSize,
                height: gridSize,
                // padding: GRID_PADDING,
            }}
        >
            {/* Background grid cells */}
            {Array.from({ length: 16 }).map((_, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                return (
                    <div
                        key={`cell-${index}`}
                        className="absolute bg-[#cdc1b4] rounded-lg"
                        style={{
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                            top: row * (TILE_SIZE + TILE_GAP) + GRID_PADDING,
                            left: col * (TILE_SIZE + TILE_GAP) + GRID_PADDING,
                        }}
                    />
                );
            })}

            {/* Game tiles */}
            {tiles.map(tile => (
                <Tile key={tile.id} tile={tile} />
            ))}

        </div>
    );
};

export default GameBoard;