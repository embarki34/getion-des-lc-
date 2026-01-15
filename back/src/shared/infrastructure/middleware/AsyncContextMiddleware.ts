import { Request, Response, NextFunction } from 'express';
import { AsyncContext } from '../async-context/AsyncContext';

export const asyncContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
    AsyncContext.run(() => {
        // Capture IP and User Agent early
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.get('user-agent') || 'unknown';

        AsyncContext.setIpAddress(ip);
        AsyncContext.setUserAgent(userAgent);

        next();
    });
};
