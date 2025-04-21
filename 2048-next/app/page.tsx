'use client';

import GameBoard from '@/components/GameBoard';
import { useGame } from '@/hooks/useGame';

export default function Home() {
  const { tiles } = useGame();

  return (
    <main className="flex justify-center items-center h-screen bg-zinc-900">
      <GameBoard tiles={tiles} />
    </main>
  );
}
