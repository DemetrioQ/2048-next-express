import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

interface ErrorBody {
    error: string;
    message: string;
    issues?: unknown;
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }

    let body: ErrorBody;
    let status: number;

    if (err instanceof AppError) {
        status = err.status;
        body = { error: err.code, message: err.message };
    } else if (err instanceof ZodError) {
        status = 400;
        body = { error: 'invalid_payload', message: 'Invalid request payload', issues: err.issues };
    } else if (err instanceof mongoose.Error.ValidationError) {
        status = 400;
        body = { error: 'validation_error', message: err.message };
    } else if (err instanceof mongoose.Error.CastError) {
        status = 400;
        body = { error: 'invalid_id', message: 'Invalid identifier' };
    } else if (err && typeof err === 'object' && 'code' in err && (err as { code?: number }).code === 11000) {
        status = 409;
        body = { error: 'duplicate', message: 'Resource already exists' };
    } else if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
        status = 401;
        body = { error: 'invalid_token', message: 'Invalid or expired token' };
    } else {
        console.error('[errorHandler] Unhandled error:', err);
        status = 500;
        body = { error: 'server_error', message: 'Internal server error' };
    }

    res.status(status).json(body);
}
