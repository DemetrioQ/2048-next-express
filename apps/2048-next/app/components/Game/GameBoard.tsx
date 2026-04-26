'use client'
import { useEffect, useRef, useState } from 'react';
import { TileData } from 'shared-2048-logic/types';
import Tile from './Tile';
import GhostTile from './GhostTile';
import ScorePop from './ScorePop';
import { TILE_GAP, TILE_SIZE, GRID_PADDING } from 'shared-2048-logic/utils/constants';

interface GameBoardProps {
    tiles: TileData[];
}

const BOARD_SIZE = TILE_SIZE * 4 + TILE_GAP * 3 + GRID_PADDING * 2;
const HORIZONTAL_MARGIN = 24;

interface Ghost {
    id: string;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
    value: number;
    kind?: string;
}

const GameBoard = ({ tiles }: GameBoardProps) => {
    const [scale, setScale] = useState(1);
    const prevTilesRef = useRef<TileData[]>([]);

    const currentIds = new Set(tiles.map(t => t.id));
    const ghosts: Ghost[] = [];
    for (const t of tiles) {
        if (!t.isMerged || !t.mergedFrom) continue;
        for (const sourceId of t.mergedFrom) {
            if (currentIds.has(sourceId)) continue;
            const source = prevTilesRef.current.find(p => p.id === sourceId);
            if (!source) continue;
            ghosts.push({
                id: sourceId,
                fromRow: source.row,
                fromCol: source.col,
                toRow: t.row,
                toCol: t.col,
                value: source.value,
                kind: source.kind,
            });
        }
    }

    useEffect(() => {
        prevTilesRef.current = tiles;
    }, [tiles]);

    useEffect(() => {
        const update = () => {
            const isMobile = window.innerWidth < 640;
            const verticalOverhead = isMobile ? 290 : 240;
            const widthScale = (window.innerWidth - HORIZONTAL_MARGIN) / BOARD_SIZE;
            const heightScale = (window.innerHeight - verticalOverhead) / BOARD_SIZE;
            setScale(Math.max(0.35, Math.min(1, widthScale, heightScale)));
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
                {ghosts.map(ghost => (
                    <GhostTile
                        key={`ghost-${ghost.id}`}
                        value={ghost.value}
                        kind={ghost.kind}
                        fromRow={ghost.fromRow}
                        fromCol={ghost.fromCol}
                        toRow={ghost.toRow}
                        toCol={ghost.toCol}
                    />
                ))}
                {tiles
                    .filter(t => t.isMerged)
                    .map(t => (
                        <ScorePop
                            key={`pop-${t.id}`}
                            value={t.value}
                            row={t.row}
                            col={t.col}
                        />
                    ))}
            </div>
        </div>
    );
};

export default GameBoard;
