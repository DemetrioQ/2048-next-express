'use client';

import { useGame } from '@/hooks/useGame';
import ScoreBoard from '@/components/ScoreBoard';
import GameBoard from '@/components/GameBoard';
import GameOverOverlay from '@/components/GameOverOverlay';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import LogoutButton from './LogoutButton';
import { toast } from 'sonner';
import Navbar from './NavBar';

export default function GameClient() {
    const { tiles, score, bestScore, gameOver, moves, seed, moveHistory, undosLeft, handleUndo, resetGame } = useGame();
    const { user } = useAuth();

    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false);
    const [scoreSubmitting, setScoreSubmitting] = useState(false);

    const handleGameReset =() =>{
        setScoreSubmitted(false);
        resetGame();
    }
    const handleSubmitScore = async () => {
        if (!user) {
            setLoginModalOpen(true);
            return;
        }

        if (scoreSubmitted || scoreSubmitting) return;
        setScoreSubmitting(true);

        try {
            const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/scores/submit`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moveHistory, score, seed, mode: 'classic' }),
            });

            const data = await res.json();

            if (res.ok) {
                setScoreSubmitted(true);
                toast.success('Score submitted!');
            } else {
                switch (data.error) {
                    case 'invalid_score':
                        toast.error("That score wasn't valid. Try playing a fresh game.");
                        break;
                    case 'duplicated_game':
                        toast.warning('This score was already submitted.');
                        break;
                    case 'invalid_payload':
                        toast.error('Invalid submission data.');
                        break;
                    default:
                        toast.error('Server error. Try again.');
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Submission failed. Check your connection.');
        } finally {
            setScoreSubmitting(false);
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
                                scoreSubmitted={scoreSubmitted}
                                scoreSubmitting={scoreSubmitting}
                                onReset={handleGameReset}
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