import React from 'react';
import { motion } from 'framer-motion';
import { tileColors } from '@/utils/tileColors';

const TILE_SIZE = 4.5 * 16;
const GAP = 8;

type TileProps = {
  id: string;
  value: number | null;
  isNew?: boolean;
  isMerged?: boolean;
  mergedFrom?: string[];
  row: number;
  col: number;
  onAnimationComplete?: (id: string) => void;
};

const Tile = ({ id, value, isNew = false, isMerged = false, mergedFrom, row, col, onAnimationComplete  }: TileProps) => {
  const bgColor = value ? tileColors[value] || '#3c3a32' : '#2f2f2f';
  const textColor = value && value > 4 ? '#f9f6f2' : '#776e65';

  return (
    <motion.div
      layout
      layoutId={id}
      initial={isNew ? { scale: 0 } : false}
      exit={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: isMerged ? [1, 1.2, 1] : 1 }}
      transition={{ layout: { duration: 0.2 }, scale: { duration: 0.2 } }}
      className="w-16 h-16 flex items-center justify-center rounded text-xl font-bold absolute"
      onAnimationComplete={() => {console.log("animation completed: " + id); onAnimationComplete?.(id)}}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        top: row * (TILE_SIZE + GAP),
        left: col * (TILE_SIZE + GAP),
        zIndex: isMerged ? 2 : 1,
      }}
    >
      {value !== null ? value : ''}
    </motion.div>
  );
};

export default Tile;