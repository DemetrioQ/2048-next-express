import { motion } from 'framer-motion';
import { TileData } from '@/types/TileData';
import { getTileColor } from '@/utils/tileColors';
import { TILE_SIZE, TILE_GAP } from '@/utils/constants';



const  Tile = ({ tile }: { tile: TileData }) => {
  const left = tile.col * (TILE_SIZE + TILE_GAP);
  const top = tile.row * (TILE_SIZE + TILE_GAP);
  const initialTop = (tile.previousRow ?? tile.row) * (TILE_SIZE + TILE_GAP);
  const initialLeft = (tile.previousCol ?? tile.col) * (TILE_SIZE + TILE_GAP);
  return (
    <motion.div
      className="absolute flex items-center justify-center font-extrabold rounded-lg shadow-inner"
      initial={{
        top: initialTop,
        left: initialLeft,
        scale: tile.isNew ? 0 : 1,
        opacity: tile.isNew ? 0 : 1,
      }}
      animate={{
        top,
        left,
        scale: tile.isMerged ? [1, 1.5, 1] : 1,
        opacity: 1,
      }}
      transition={{
        top: { duration: 0.2, ease: 'easeOut' },
        left: { duration: 0.2, ease: 'easeOut' },
        scale: tile.isMerged ? { duration: 0.15 } : 0,
      }}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        fontSize: tile.value >= 1024 ? 28 : 32,
        backgroundColor: getTileColor(tile.value),
        color: tile.value <= 4 ? '#776e65' : '#f9f6f2',
        zIndex: tile.isMerged ? 10 : 1,
      }}
    >
      {tile.value}
    </motion.div>
  );
}

export default Tile;
