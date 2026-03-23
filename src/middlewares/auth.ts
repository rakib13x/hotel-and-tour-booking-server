import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import ApiError from "../utils/ApiError";

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Authentication middleware that can be used as a higher-order function.
 * Usage:
 * - auth() - Optional authentication, sets req.user if token is valid
 * - auth('admin') - Required authentication with specific role
 * - auth(['admin', 'super_admin']) - Required authentication with one of the roles
 */
const auth = (...roles: (string | string[])[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requiredRoles = roles.flat() as string[];

  let token;

  const authHeader = req.get("Authorization");

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    if (requiredRoles.length === 0) {
      return next();
    }
    return next(new ApiError(401, "Not authorized, token missing"));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    // @ts-ignore - req.user is extended in express.d.ts but sometimes not picked up
    req.user = { id: decoded.id, role: decoded.role };

    console.log(`[AUTH] Path: ${req.path}, Method: ${req.method}`);
    console.log(`[AUTH] User Role: ${decoded.role}, Required Roles: ${JSON.stringify(requiredRoles)}`);

    if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
      console.log(`[AUTH] ❌ Forbidden: User role ${decoded.role} not in ${JSON.stringify(requiredRoles)}`);
      return next(new ApiError(403, "Forbidden - Insufficient permissions"));
    }

    console.log(`[AUTH] ✅ Authorized`);
    next();
  } catch (error) {
    if (requiredRoles.length === 0) {
      return next();
    }
    return next(new ApiError(401, "Not authorized, token invalid"));
  }
};

export default auth;
