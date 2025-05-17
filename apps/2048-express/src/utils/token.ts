import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id, email: user.email }, ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: '30d',
  });
};


export const generateTokens = (user: IUser) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};
