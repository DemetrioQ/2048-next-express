'use client'
import { useEffect, useState } from 'react';
import { TileData } from 'shared-2048-logic/types';
import Tile from './Tile';
import { TILE_GAP, TILE_SIZE, GRID_PADDING } from 'shared-2048-logic/utils/constants';

interface GameBoardProps {
    tiles: TileData[];
}

const BOARD_SIZE = TILE_SIZE * 4 + TILE_GAP * 3 + GRID_PADDING * 2;
const HORIZONTAL_MARGIN = 32;

const GameBoard = ({ tiles }: GameBoardProps) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () => {
            const available = window.innerWidth - HORIZONTAL_MARGIN;
            setScale(Math.min(1, available / BOARD_SIZE));
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <div style={{ width: BOARD_SIZE * scale, height: BOARD_SIZE * scale }}>
            <div
                data-game-board
                className="relative bg-[#bbada0] rounded-lg"
                style={{
                    width: BOARD_SIZE,
                    height: BOARD_SIZE,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    touchAction: 'none',
                }}
            >
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

                {tiles.map(tile => (
                    <Tile key={tile.id} tile={tile} />
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
