import { motion } from 'framer-motion';
import { getTileColor } from '@/utils/tileColors';
import { TILE_SIZE, TILE_GAP, GRID_PADDING } from 'shared-2048-logic/utils/constants';
import { TileData } from 'shared-2048-logic/types';

interface TileProps {
    tile: TileData;
}

const Tile = ({ tile }: TileProps) => {
    return (
        <motion.div
            className="absolute flex items-center justify-center font-bold rounded-lg shadow-inner"
            style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: getTileColor(tile.value),
                color: tile.value <= 4 ? '#776e65' : '#f9f6f2',
                fontSize: tile.value >= 1024 ? 28 : 36,
                top: (tile.previousRow ?? tile.row) * (TILE_SIZE + TILE_GAP) + GRID_PADDING,
                left: (tile.previousCol ?? tile.col) * (TILE_SIZE + TILE_GAP) + GRID_PADDING,
                zIndex: 10,
            }}
            initial={{
                top: (tile.previousRow ?? tile.row) * (TILE_SIZE + TILE_GAP),
                left: (tile.previousCol ?? tile.col) * (TILE_SIZE + TILE_GAP),
                scale: tile.isNew ? 0 : 1,
            }}
            animate={{
                top: tile.row * (TILE_SIZE + TILE_GAP) + GRID_PADDING,
                left: tile.col * (TILE_SIZE + TILE_GAP) + GRID_PADDING,
                scale: tile.isMerged ? [1, 1.1, 1] : 1,
            }}
            transition={{
                duration: 0.1,
                ease: "easeOut"
            }}
        >
            {tile.value}
        </motion.div>
    );
};

export default Tile;