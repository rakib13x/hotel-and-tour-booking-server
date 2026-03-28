import { NextFunction, Request, Response } from "express";
/**
 * Middleware to check if the authenticated user is an admin
 */
export declare const adminMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default adminMiddleware;
//# sourceMappingURL=adminMiddleware.d.ts.map