import { describe, it, expect } from 'vitest';
import { moveTiles } from '../utils/moveLogic';
import { TileData } from '../types/TileData';

const t = (id: string, row: number, col: number, value: number): TileData => ({
  id,
  row,
  col,
  value,
});

describe('moveTiles', () => {
  it('reports moved=false when no tile changes position', () => {
    const tiles = [t('a', 0, 0, 2), t('b', 1, 0, 4)];
    const result = moveTiles(tiles, 'left');
    expect(result.moved).toBe(false);
    expect(result.score).toBe(0);
  });

  it('slides a single tile to the wall', () => {
    const result = moveTiles([t('a', 0, 2, 2)], 'left');
    expect(result.moved).toBe(true);
    expect(result.tiles).toHaveLength(1);
    expect(result.tiles[0]).toMatchObject({ id: 'a', row: 0, col: 0, value: 2 });
  });

  it('merges two equal tiles into one with isMerged and mergedFrom', () => {
    const tiles = [t('a', 0, 0, 2), t('b', 0, 1, 2)];
    const result = moveTiles(tiles, 'left');
    expect(result.moved).toBe(true);
    expect(result.score).toBe(4);
    expect(result.tiles).toHaveLength(1);
    expect(result.tiles[0]).toMatchObject({
      row: 0,
      col: 0,
      value: 4,
      isMerged: true,
      mergedFrom: ['a', 'b'],
    });
  });

  it('does not merge unequal tiles', () => {
    const tiles = [t('a', 0, 0, 2), t('b', 0, 2, 4)];
    const result = moveTiles(tiles, 'left');
    expect(result.moved).toBe(true);
    expect(result.tiles).toHaveLength(2);
    expect(result.tiles.find(x => x.id === 'a')).toMatchObject({ col: 0, value: 2 });
    expect(result.tiles.find(x => x.id === 'b')).toMatchObject({ col: 1, value: 4 });
    expect(result.tiles.every(x => !x.isMerged)).toBe(true);
  });

  it('produces two merges from a full row of equal tiles', () => {
    const tiles = [
      t('a', 0, 0, 2),
      t('b', 0, 1, 2),
      t('c', 0, 2, 2),
      t('d', 0, 3, 2),
    ];
    const result = moveTiles(tiles, 'left');
    expect(result.moved).toBe(true);
    expect(result.score).toBe(8);
    expect(result.tiles).toHaveLength(2);
    expect(result.tiles[0]).toMatchObject({ col: 0, value: 4, isMerged: true });
    expect(result.tiles[1]).toMatchObject({ col: 1, value: 4, isMerged: true });
  });

  it('does not chain merges in a single move ([2,2,4] left → [4,4])', () => {
    const tiles = [t('a', 0, 0, 2), t('b', 0, 1, 2), t('c', 0, 2, 4)];
    const result = moveTiles(tiles, 'left');
    expect(result.moved).toBe(true);
    expect(result.score).toBe(4);
    expect(result.tiles).toHaveLength(2);
    expect(result.tiles[0]).toMatchObject({ col: 0, value: 4, isMerged: true });
    expect(result.tiles[1]).toMatchObject({ col: 1, value: 4, isMerged: false });
  });

  it('applies vertical merges for up/down', () => {
    const tiles = [t('a', 0, 0, 2), t('b', 2, 0, 2)];
    const result = moveTiles(tiles, 'up');
    expect(result.moved).toBe(true);
    expect(result.tiles).toHaveLength(1);
    expect(result.tiles[0]).toMatchObject({ row: 0, col: 0, value: 4, isMerged: true });
  });
});
