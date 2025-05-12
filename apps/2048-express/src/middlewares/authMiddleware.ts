import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include user information
interface DecodedToken {
  id: string;
  email: string;
}

interface RequestWithUser extends Request {
  user?: DecodedToken;
}

export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  if (req.user) {
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(401).json({ message: 'Unauthorized' }); // Send unauthorized response
  }
};
