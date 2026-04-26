import { TileData } from '../types/TileData';

export interface MergeResult {
  value: number;
  kind?: string;
}

export interface MergeReward {
  undoBonus?: number;
}

export interface TileVisual {
  background: string;
  color: string;
  fontSize: number;
}

export interface TileKind {
  id: string;
  // Whether `self` (already positioned) absorbs `other` (moving in).
  // Return the resulting tile spec or null if they cannot merge.
  merge?(self: TileData, other: TileData): MergeResult | null;
  // Reward granted when a merge produces this kind at `value`.
  mergeReward?(value: number): MergeReward | undefined;
  // Visual presentation. Consumed by the frontend to render a tile.
  visual?(tile: Pick<TileData, 'value' | 'kind'>): TileVisual;
}

const REGISTRY = new Map<string, TileKind>();

export function registerTileKind(kind: TileKind): void {
  REGISTRY.set(kind.id, kind);
}

export function getTileKind(id: string): TileKind | undefined {
  return REGISTRY.get(id);
}

export function kindOf(tile: Pick<TileData, 'kind'>): string {
  return tile.kind ?? 'number';
}

export function tryMerge(self: TileData, other: TileData): MergeResult | null {
  const kind = REGISTRY.get(kindOf(self));
  return kind?.merge?.(self, other) ?? null;
}

export function rewardForMerge(
  tile: Pick<TileData, 'value' | 'kind'>,
): MergeReward | undefined {
  const kind = REGISTRY.get(kindOf(tile));
  return kind?.mergeReward?.(tile.value);
}

const FALLBACK_VISUAL: TileVisual = {
  background: '#3c3a32',
  color: '#f9f6f2',
  fontSize: 36,
};

export function tileVisual(tile: Pick<TileData, 'value' | 'kind'>): TileVisual {
  const kind = REGISTRY.get(kindOf(tile));
  return kind?.visual?.(tile) ?? FALLBACK_VISUAL;
}

// --- Built-in kinds ------------------------------------------------------

const NUMBER_COLORS: Record<number, string> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

const NUMBER_KIND: TileKind = {
  id: 'number',
  merge(self, other) {
    if (kindOf(other) !== 'number') return null;
    if (self.value !== other.value) return null;
    return { value: self.value * 2 };
  },
  mergeReward(value) {
    if (value === 128) return { undoBonus: 1 };
    return undefined;
  },
  visual(tile) {
    return {
      background: NUMBER_COLORS[tile.value] ?? '#3c3a32',
      color: tile.value <= 4 ? '#776e65' : '#f9f6f2',
      fontSize: tile.value >= 1024 ? 28 : 36,
    };
  },
};

registerTileKind(NUMBER_KIND);

// --- Spawn ---------------------------------------------------------------
// IMPORTANT: pickSpawn must consume exactly one rng() draw and preserve the
// existing 90/10 weighting. The replay protocol (verifyGame) counts on the
// RNG sequence being identical between client play and server replay.

export interface SpawnSpec {
  value: number;
  kind?: string;
}

export function pickSpawn(rng: () => number): SpawnSpec {
  return rng() < 0.9 ? { value: 2 } : { value: 4 };
}
