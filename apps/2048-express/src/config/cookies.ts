import { CookieOptions } from 'express';
import { ACCESS_TOKEN_EXPIRY_MS } from './constants';

export const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: ACCESS_TOKEN_EXPIRY_MS,
};