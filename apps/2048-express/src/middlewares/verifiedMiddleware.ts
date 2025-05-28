import { Request, Response, NextFunction } from 'express';

export const verifiedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.verified) {
     res.status(403).json({ message: 'Email not verified.' });
     return;
  }
  next();
};