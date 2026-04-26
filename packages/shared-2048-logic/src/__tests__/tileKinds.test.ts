import { describe, it, expect } from 'vitest';
import { tryMerge, pickSpawn, rewardForMerge } from '../engine/tileKinds';
import { TileData } from '../types/TileData';

const tile = (overrides: Partial<TileData> & { value: number }): TileData => ({
  id: 'x',
  row: 0,
  col: 0,
  ...overrides,
});

describe('tryMerge (number kind)', () => {
  it('merges two equal-value number tiles into value*2', () => {
    const a = tile({ value: 4, id: 'a' });
    const b = tile({ value: 4, id: 'b' });
    expect(tryMerge(a, b)).toEqual({ value: 8 });
  });

  it('returns null for unequal values', () => {
    expect(tryMerge(tile({ value: 2 }), tile({ value: 4 }))).toBeNull();
  });

  it('returns null when other tile has a non-number kind', () => {
    expect(tryMerge(tile({ value: 4 }), tile({ value: 4, kind: 'mystery' }))).toBeNull();
  });
});

describe('pickSpawn', () => {
  it('returns value 2 when rng < 0.9', () => {
    const rng = () => 0.5;
    expect(pickSpawn(rng)).toEqual({ value: 2 });
  });

  it('returns value 4 when rng >= 0.9', () => {
    const rng = () => 0.95;
    expect(pickSpawn(rng)).toEqual({ value: 4 });
  });

  it('consumes exactly one rng draw', () => {
    let calls = 0;
    const rng = () => { calls++; return 0.1; };
    pickSpawn(rng);
    expect(calls).toBe(1);
  });
});

describe('rewardForMerge (number kind)', () => {
  it('grants +1 undo for the 128 milestone', () => {
    expect(rewardForMerge({ value: 128 })).toEqual({ undoBonus: 1 });
  });

  it('grants no reward for non-milestone values', () => {
    expect(rewardForMerge({ value: 64 })).toBeUndefined();
    expect(rewardForMerge({ value: 256 })).toBeUndefined();
  });
});
