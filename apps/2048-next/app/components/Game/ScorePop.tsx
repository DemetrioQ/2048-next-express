import { motion } from 'framer-motion';
import { TILE_SIZE, TILE_GAP, GRID_PADDING } from 'shared-2048-logic/utils/constants';

interface ScorePopProps {
    value: number;
    row: number;
    col: number;
}

const ScorePop = ({ value, row, col }: ScorePopProps) => {
    const x = col * (TILE_SIZE + TILE_GAP) + GRID_PADDING;
    const y = row * (TILE_SIZE + TILE_GAP) + GRID_PADDING;
    return (
        <motion.div
            className="absolute pointer-events-none font-bold text-[#776e65] flex items-center justify-center"
            style={{
                top: 0,
                left: 0,
                width: TILE_SIZE,
                height: TILE_SIZE,
                zIndex: 20,
                fontSize: 22,
                willChange: 'transform, opacity',
            }}
            initial={{ x, y, opacity: 1 }}
            animate={{ x, y: y - 40, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            +{value}
        </motion.div>
    );
};

export default ScorePop;
