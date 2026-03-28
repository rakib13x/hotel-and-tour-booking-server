import { NextFunction, Request, Response } from "express";
/**
 * Authentication middleware that can be used as a higher-order function.
 * Usage:
 * - auth() - Optional authentication, sets req.user if token is valid
 * - auth('admin') - Required authentication with specific role
 * - auth(['admin', 'super_admin']) - Required authentication with one of the roles
 */
declare const auth: (...roles: (string | string[])[]) => (req: Request, res: Response, next: NextFunction) => void;
export default auth;
//# sourceMappingURL=auth.d.ts.map