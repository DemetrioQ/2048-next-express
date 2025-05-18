import { Request, Response, NextFunction } from 'express';
import RequestLog from '../models/RequestLog';

export async function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Capture the original send function
  const oldSend = res.send.bind(res);

  // Variable to store response body
  let responseBody: any;

  // Override res.send to capture response body
  res.send = (body?: any): Response => {
    responseBody = body;
    return oldSend(body);
  };

  res.on('finish', async () => {
    try {
      // Avoid logging static files or health checks if you want:
      // if (req.originalUrl.startsWith('/static') || req.originalUrl === '/health') return;

      await RequestLog.create({
        userId: (req.user as any)?._id, // adjust based on your auth middleware type
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
        requestBody: req.body,
        responseStatus: res.statusCode,
        responseBody: parseResponseBody(responseBody),
        timestamp: new Date(),
        durationMs: Date.now() - start,
        userAgent: req.headers['user-agent'],
      });
    } catch (error) {
      console.error('Failed to log request:', error);
    }
  });

  next();
}

// Helper to safely parse response body if it's JSON string
function parseResponseBody(body: any): any {
  if (!body) return undefined;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return body; // return as string if not JSON parseable
    }
  }
  return body;
}
