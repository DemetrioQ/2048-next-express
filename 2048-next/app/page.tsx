'use client';

import GameBoard from '@/components/GameBoard';
import { useGame } from '@/hooks/useGame';
import ScoreBoard from './components/ScoreBoard';

export default function Home() {
  const { tiles, score, bestScore } = useGame();

  return (

    <main className="flex flex-col justify-center items-center min-h-screen bg-[#faf8ef] p-4">
      <div className="max-w-md w-full">
        <h1 className="text-5xl font-bold text-[#776e65] mb-2">2048</h1>
        <ScoreBoard 
          score={score} 
          bestScore={bestScore} 
        />
        <GameBoard tiles={tiles} score={score} bestScore={bestScore} />
        <div className="mt-4 text-sm text-[#776e65]">
          <p>Join the tiles, get to <strong>2048!</strong></p>
          <p>Use arrow keys or WASD to move</p>
        </div>
      </div>
    </main>
  );
}
