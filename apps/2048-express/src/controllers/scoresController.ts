
import { Request, Response, NextFunction } from 'express';
import { IUser } from 'src/models/User';
import { verifyGame } from 'shared-2048-logic/utils/gameLogic'
import { submitScoreSchema } from 'shared-2048-logic/schemas/scoreSubmit'
import Score from 'src/models/Score';
import { hashGame } from 'src/utils/hash';

export const submitScore = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser

    const parsed = submitScoreSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'invalid_payload', message: 'Invalid submission payload' });
        return;
    }
    const { moveHistory, score, seed, mode } = parsed.data;

    try {
        const isValid = verifyGame(moveHistory, seed, score)

        if (!isValid) {
            console.warn(`[CHEAT] User ${user.id} submitted invalid score`);
            res.status(400).json({ error: 'invalid_score', message: 'Score could not be verified' });
            return;
        }

        const gameHash = hashGame(seed, moveHistory);

        const existing = await Score.findOne({ gameHash });
        if (existing) {
            console.warn(`[DUPLICATE] User ${user.id} tried submitting a game twice`);
            res.status(400).json({ error: 'duplicated_game', message: 'This game has already been submitted' });
            return;
        }

        await Score.create({ userId: user.id, score, mode, gameHash });
        res.status(201).json({ message: 'Score submitted' });
        return;
    }
    catch (err: unknown) {
        // Race: a concurrent submit with the same hash slipped past findOne.
        // The unique index on gameHash backstops it.
        if (err && typeof err === 'object' && 'code' in err && (err as { code?: number }).code === 11000) {
            console.warn(`[DUPLICATE] User ${user.id} hit dup-key on score submit`);
            res.status(400).json({ error: 'duplicated_game', message: 'This game has already been submitted' });
            return;
        }
        next(err);
    }
}
