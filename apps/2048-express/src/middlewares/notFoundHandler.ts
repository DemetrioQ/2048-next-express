import { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({ error: 'not_found', message: `Route ${req.method} ${req.originalUrl} not found` });
}
