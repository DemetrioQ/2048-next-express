
import { Request, Response } from 'express';
import { IUser } from 'src/models/User';
import { TileMove } from 'shared-2048-logic/types/TileMove'
import { verifyGame } from 'shared-2048-logic/utils/gameLogic'
import Score from 'src/models/Score';
import { hashGame } from 'src/utils/hash';
//export const x = async (req: Request, res: Response) =>{}

export const submitScore = async (req: Request, res: Response) => {
    const { score, mode, seed } = req.body;
    const moveHistory = req.body.moveHistory as TileMove[]
    const user = req.user as IUser

    try {

    if (typeof score !== 'number' || score < 0 || !Array.isArray(moveHistory) || !seed) {
         res.status(400).json({ error: 'invalid_payload' });
         return
    }

        const isValid = verifyGame(moveHistory, seed, score)

        if (!isValid) {
            console.warn(`[CHEAT] User ${user.id} submitted invalid score`);
            res.status(400).json({ error: 'invalid_score' });
            return;
        }

        const gameHash = hashGame(seed, moveHistory);

        const existing = await Score.findOne({ gameHash });
        if (existing) {
            console.warn(`[DUPLICATE] User ${user.id} tried submitting a game twice`);
            res.status(400).json({ error: 'duplicated_game' });
            return;
        }

        await Score.create({ userId: user.id, score, mode, gameHash });
        res.status(201).json({ message: 'Score submitted' });
        return;
    }
    catch (err) {
        console.error(`[ERROR] Failed to submit score for user ${user.id}`, err);
        res.status(500).json({ error: 'server_error' });
        return;

    }

}