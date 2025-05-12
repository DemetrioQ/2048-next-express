'use client';

import { useGame } from '@/hooks/useGame';
import ScoreBoard from '@/components/ScoreBoard';
import GameBoard from '@/components/GameBoard';
import GameOverOverlay from '@/components/GameOverOverlay';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function GameClient() {
    const { tiles, score, bestScore, gameOver, moves, undosLeft, handleUndo, resetGame } = useGame();
    const { user } = useAuth();

    const [loginModalOpen, setLoginModalOpen] = useState(false);
  
    const handleSubmitScore = () => {
      if (!user) {
        setLoginModalOpen(true);
      } else {
        console.log('Submitting score for:', user.email);
        // TODO: Call your score submission API here
      }
    };

    return (
        <>          
        <h1 className="text-5xl font-bold text-[#776e65] mb-2">2048</h1>
            {/* Animated ScoreBoard/GameOver container */}
            <div className="mb-4 w-full max-w-[500px]">
                <AnimatePresence mode='wait'>
                    {gameOver ? (
                        <motion.div
                            key="game-over"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <GameOverOverlay
                                score={score}
                                moves={moves}
                                undosLeft={undosLeft}
                                onReset={resetGame}
                                onUndo={handleUndo}
                                onSubmitScore={handleSubmitScore}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="score-board"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-4 justify-center"
                        >
                            <ScoreBoard score={score} bestScore={bestScore} undosLeft={undosLeft} resetGame={resetGame} onUndo={handleUndo} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


            <div className="relative">
                <GameBoard
                    tiles={tiles}
                    score={score}
                    bestScore={bestScore}
                    gameOver={gameOver}
                    onReset={resetGame}
                />

            </div>

            <div className="mt-4 text-sm text-[#776e65]">
                <p>Join the tiles, get to <strong>2048!</strong></p>
                <p>Use arrow keys or WASD to move</p>
            </div>

            <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
}