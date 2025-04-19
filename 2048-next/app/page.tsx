'use client';

import GameBoard from '@/components/GameBoard';
import { useGame } from '@/hooks/useGame';

export default function Home() {
  const { grid } = useGame();

  return (
    <main className="flex justify-center items-center h-screen bg-zinc-900">
      <GameBoard grid={grid} />
    </main>
  );
}
