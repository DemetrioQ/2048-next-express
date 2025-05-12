'use client';

import { AuthProvider } from '@/context/AuthContext';
import GameClient from './GameClient';

export default function GameClientWrapper() {
  return (
    <AuthProvider>
      <GameClient />
    </AuthProvider>
  );
}
