import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async Express handler to catch errors and pass them to Express middleware.
 * @param fn - Async function to wrap
 * @returns Express route handler
 */
export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
        (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
