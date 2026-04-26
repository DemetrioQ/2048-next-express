'use client';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';

interface WinOverlayProps {
    score: number;
    onKeepGoing: () => void;
    onSubmit: () => void;
    canSubmit: boolean;
    submitting: boolean;
}

const WinOverlay = ({ score, onKeepGoing, onSubmit, canSubmit, submitting }: WinOverlayProps) => {
    return (
        <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: 'rgba(238, 228, 218, 0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <div className="text-center px-6">
                <motion.h2
                    className="text-4xl sm:text-5xl font-bold text-[#776e65] mb-2"
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    You made 2048!
                </motion.h2>
                <p className="text-[#776e65] mb-5 text-lg">{score} points so far</p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onKeepGoing}
                        className="bg-[#8f7a66] text-white rounded py-3 px-4 hover:bg-[#7c6b5a] transition-colors flex items-center justify-center gap-2"
                    >
                        <Play className="w-4 h-4" />
                        Keep going
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: canSubmit ? 1.04 : 1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onSubmit}
                        disabled={!canSubmit || submitting}
                        className={`bg-[#3c3a32] text-white rounded py-3 px-4 transition-colors flex items-center justify-center gap-2 ${
                            canSubmit ? 'hover:bg-[#2c2a22]' : 'opacity-60 cursor-not-allowed'
                        }`}
                    >
                        <Trophy className="w-4 h-4" />
                        {submitting ? 'Submitting...' : 'Submit Score'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default WinOverlay;
