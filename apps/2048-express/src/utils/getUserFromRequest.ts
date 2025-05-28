// utils/getUserFromRequest.ts

import jwt from 'jsonwebtoken';
import User from 'src/models/User';
import { Request } from 'express';

export async function getUserFromRequest(req: Request) {
  const token = req.cookies?.access_token;

  if (!token) throw new Error('No access token provided');

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string };
    const user = await User.findById(payload.id).select('-password');
    if (!user) throw new Error('User not found');

    return user;
  } catch (err) {
    console.error('JWT verification failed:', err);
    throw new Error('Invalid or expired token');
  }
}
