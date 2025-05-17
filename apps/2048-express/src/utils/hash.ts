import crypto from 'crypto';
import { TileMove } from 'shared-2048-logic/types';

export function hashGame(seed: string, moves: TileMove[]): string {
  const data = JSON.stringify({ seed, moves });
  return crypto.createHash('sha256').update(data).digest('hex');
}
