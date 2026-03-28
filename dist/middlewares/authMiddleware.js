"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const protect = (req, res, next) => {
    let token;
    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        return next(new ApiError_1.default(401, "Not authorized, token missing"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtSecret);
        // Now properly typed without 'any'
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (error) {
        return next(new ApiError_1.default(401, "Not authorized, token invalid"));
    }
};
exports.default = protect;
//# sourceMappingURL=authMiddleware.js.map