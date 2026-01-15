import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async express route handler and catches any errors, 
 * passing them to the next middleware (error handler).
 * 
 * @param fn The async route handler function
 * @returns A wrapped function that handles errors
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
