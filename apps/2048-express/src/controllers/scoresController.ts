
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

        if (typeof score !== 'number' || score < 0) {
            res.status(400).json({ error: 'Invalid score' });
            return;
        }
        const isValid = verifyGame(moveHistory, seed, score)

        if (!isValid) {
            res.status(400).json({ error: 'Invalid game replay' });
            return;
        }

        const gameHash = hashGame(seed, moveHistory);

        const existing = await Score.findOne({ gameHash });
        if (existing) {
            res.status(400).json({ error: 'This game has already been submitted' });
            return;
        }

        await Score.create({ userId: user.id, score, mode, gameHash });
        res.status(201).json({ message: 'Score submitted' });
        return;
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;

    }

}