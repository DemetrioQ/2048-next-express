import { CookieOptions } from 'express';
import { ACCESS_TOKEN_EXPIRY_MS, REFRESH_TOKEN_EXPIRY_MS } from './constants';

export const baseCookieOptionsAccessToken: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: ACCESS_TOKEN_EXPIRY_MS,
};


export const baseCookieOptionsRefreshToken: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
};