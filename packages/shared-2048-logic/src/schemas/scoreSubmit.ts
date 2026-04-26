import { z } from 'zod';

export const directionSchema = z.enum(['up', 'down', 'left', 'right']);

const spawnedTileSchema = z.object({
  row: z.number().int().min(0).max(3),
  col: z.number().int().min(0).max(3),
  value: z.number().int().positive(),
});

export const tileMoveSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('init'),
    move: z.undefined().optional(),
    spawnedTile: spawnedTileSchema.strict(),
  }),
  z.object({
    type: z.literal('move'),
    move: directionSchema,
    spawnedTile: spawnedTileSchema,
  }),
]);

export const GAME_MODES = ['classic'] as const;
export const gameModeSchema = z.enum(GAME_MODES);
export type GameMode = z.infer<typeof gameModeSchema>;

export const submitScoreSchema = z.object({
  moveHistory: z.array(tileMoveSchema).min(2),
  score: z.number().int().nonnegative(),
  seed: z.string().min(1).max(256),
  mode: gameModeSchema,
});

export type SubmitScoreBody = z.infer<typeof submitScoreSchema>;
export type ValidatedTileMove = z.infer<typeof tileMoveSchema>;
