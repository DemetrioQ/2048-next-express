import { TileData } from '@/types/TileData';
import { TILE_SIZE, TILE_GAP, GRID_PADDING } from '@/utils/constants';
import Tile from './Tile';

interface GameBoardProps {
    tiles: TileData[];
    score: number;
    bestScore: number;
    gameOver: boolean;
    onReset: () => void;
}

const GameBoard = ({ tiles, score, bestScore, gameOver, onReset }: GameBoardProps) => {
    const gridSize = TILE_SIZE * 4 + TILE_GAP * 5; // 4 tiles + 5 gaps

    return (
        <div
            className="relative bg-[#bbada0] rounded-lg"
            style={{
                width: gridSize,
                height: gridSize,
                padding: GRID_PADDING,
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
                            top: row * (TILE_SIZE + TILE_GAP),
                            left: col * (TILE_SIZE + TILE_GAP),
                        }}
                    />
                );
            })}

            {/* Game tiles */}
            {tiles.map(tile => (
                <Tile key={tile.id} tile={tile}/>
            ))}

            {/* Game Over overlay */}
            {gameOver && (
                <div className="absolute inset-0 bg-opacity-90 bg-[#bbada0] flex items-center justify-center z-50">
                    <div className="text-center p-6">
                        <h2 className="text-4xl font-bold text-[#776e65] mb-4">Game Over!</h2>
                        <p className="text-xl text-[#776e65] mb-6">Your score: {score}</p>
                        <button
                            onClick={onReset}
                            className="bg-[#8f7a66] text-white text-xl font-bold rounded-lg px-8 py-3 hover:bg-[#9f8b77] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;