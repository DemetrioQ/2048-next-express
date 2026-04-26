import { motion } from 'framer-motion';
import { TILE_SIZE, TILE_GAP, GRID_PADDING } from 'shared-2048-logic/utils/constants';
import { TileData } from 'shared-2048-logic/types';
import { tileVisual } from 'shared-2048-logic/engine/tileKinds';

interface TileProps {
    tile: TileData;
}

const xFor = (col: number) => col * (TILE_SIZE + TILE_GAP) + GRID_PADDING;
const yFor = (row: number) => row * (TILE_SIZE + TILE_GAP) + GRID_PADDING;

const Tile = ({ tile }: TileProps) => {
    const x = xFor(tile.col);
    const y = yFor(tile.row);
    const visual = tileVisual(tile);

    return (
        <motion.div
            className="absolute flex items-center justify-center font-bold rounded-lg shadow-inner"
            style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                top: 0,
                left: 0,
                backgroundColor: visual.background,
                color: visual.color,
                fontSize: visual.fontSize,
                zIndex: 10,
                willChange: 'transform',
            }}
            initial={{
                x,
                y,
                scale: tile.isNew ? 0 : 1,
            }}
            animate={{
                x,
                y,
                scale: tile.isMerged ? [1, 1.25, 1] : 1,
            }}
            transition={{
                default: { duration: 0.1, ease: 'easeOut' },
                scale: tile.isMerged
                    ? { duration: 0.22, delay: 0.08, ease: 'easeOut', times: [0, 0.45, 1] }
                    : { duration: 0.12, ease: 'easeOut' },
            }}
        >
            {tile.value}
        </motion.div>
    );
};

export default Tile;
