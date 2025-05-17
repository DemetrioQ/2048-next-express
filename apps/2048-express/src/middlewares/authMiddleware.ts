import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import User from 'src/models/User';
// // Extend the Request interface to include user information
// interface DecodedToken {
//   id: string;
//   email: string;
// }

// interface RequestWithUser extends Request {
//   user?: DecodedToken;
// }

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   const token = req.cookies.access_token;
    if (!token) {
      res.status(401).json({ message: 'No access token provided' });
      return;
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string };
  
      const user = await User.findById(payload.id).select('-password'); // remove sensitive data
  
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      
      req.user  = user;
      next();
  
    } catch (err) {
      console.error('JWT verification failed:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
};
