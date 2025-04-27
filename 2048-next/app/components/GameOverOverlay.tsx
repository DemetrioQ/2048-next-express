import { motion } from 'framer-motion';

interface GameOverOverlayProps {
    score: number;
    moves: number;
    undosLeft: number;
    onReset: () => void;
    onUndo: () => void
}

const GameOverOverlay = ({ score, moves, undosLeft, onReset, onUndo }: GameOverOverlayProps) => {
    return (
        <div className="bg-[#bbada0] rounded-lg p-6 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-[#776e65] mb-2">Game Over</h2>
            <p className="text-[#776e65] mb-4">
                {score} points in {moves} moves
            </p>
            
            <div className="flex flex-col gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    className="w-full bg-[#8f7a66] text-white rounded py-3 px-4 hover:bg-[#7c6b5a] transition-colors"
                >
                    Play Again
                </motion.button>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onUndo}
                    className="w-full bg-[#d6cdc4] text-[#776e65] rounded py-2 px-4 hover:bg-[#c4b9ae] transition-colors"
                >
                    Undo ({undosLeft} left)
                </motion.button>
            </div>
        </div>
    );
};

export default GameOverOverlay;