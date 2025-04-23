'use client';

import { useGame } from '@/hooks/useGame';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';

export default function Home() {
    const { tiles, score, bestScore, gameOver, resetGame } = useGame();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-[#faf8ef] p-4">
            <h1 className="text-5xl font-bold text-[#776e65] mb-2">2048</h1>

            <div className="flex gap-4 mb-4">
                <ScoreBoard score={score} bestScore={bestScore} />
                <button
                    onClick={resetGame}
                    className="bg-[#8f7a66] text-white rounded-lg px-4 py-2 text-center hover:bg-[#9f8b77] transition-colors"
                >
                    New Game
                </button>
            </div>

            <div>
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
        </main>
    );
}