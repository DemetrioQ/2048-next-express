import { motion } from 'framer-motion';
import { TILE_SIZE, TILE_GAP, GRID_PADDING } from 'shared-2048-logic/utils/constants';
import { tileVisual } from 'shared-2048-logic/engine/tileKinds';

interface GhostTileProps {
    value: number;
    kind?: string;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
}

const xFor = (col: number) => col * (TILE_SIZE + TILE_GAP) + GRID_PADDING;
const yFor = (row: number) => row * (TILE_SIZE + TILE_GAP) + GRID_PADDING;

const GhostTile = ({ value, kind, fromRow, fromCol, toRow, toCol }: GhostTileProps) => {
    const visual = tileVisual({ value, kind });
    return (
        <motion.div
            className="absolute flex items-center justify-center font-bold rounded-lg shadow-inner pointer-events-none"
            style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                top: 0,
                left: 0,
                backgroundColor: visual.background,
                color: visual.color,
                fontSize: visual.fontSize,
                zIndex: 5,
                willChange: 'transform, opacity',
            }}
            initial={{
                x: xFor(fromCol),
                y: yFor(fromRow),
                opacity: 1,
            }}
            animate={{
                x: xFor(toCol),
                y: yFor(toRow),
                opacity: 0,
            }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
        >
            {value}
        </motion.div>
    );
};

export default GhostTile;
