"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Authentication middleware that can be used as a higher-order function.
 * Usage:
 * - auth() - Optional authentication, sets req.user if token is valid
 * - auth('admin') - Required authentication with specific role
 * - auth(['admin', 'super_admin']) - Required authentication with one of the roles
 */
const auth = (...roles) => (req, res, next) => {
    const requiredRoles = roles.flat();
    let token;
    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        if (requiredRoles.length === 0) {
            return next();
        }
        return next(new ApiError_1.default(401, "Not authorized, token missing"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtSecret);
        // @ts-ignore - req.user is extended in express.d.ts but sometimes not picked up
        req.user = { id: decoded.id, role: decoded.role };
        console.log(`[AUTH] Path: ${req.path}, Method: ${req.method}`);
        console.log(`[AUTH] User Role: ${decoded.role}, Required Roles: ${JSON.stringify(requiredRoles)}`);
        if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
            console.log(`[AUTH] ❌ Forbidden: User role ${decoded.role} not in ${JSON.stringify(requiredRoles)}`);
            return next(new ApiError_1.default(403, "Forbidden - Insufficient permissions"));
        }
        console.log(`[AUTH] ✅ Authorized`);
        next();
    }
    catch (error) {
        if (requiredRoles.length === 0) {
            return next();
        }
        return next(new ApiError_1.default(401, "Not authorized, token invalid"));
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map