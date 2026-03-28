"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const auth_model_1 = __importDefault(require("../modules/auth/auth.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Middleware to check if the authenticated user is an admin
 */
const adminMiddleware = async (req, res, next) => {
    try {
        // Get user ID from request (set by authMiddleware)
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError_1.default(401, "Authentication required");
        }
        // Find user in database
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            throw new ApiError_1.default(401, "User not found");
        }
        console.log("user", user);
        // Check if user is admin
        if (user.role !== "admin" && user.role !== "super_admin") {
            throw new ApiError_1.default(403, "Access denied. Admin privileges required");
        }
        // Add user info to request
        req.admin = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.adminMiddleware = adminMiddleware;
exports.default = exports.adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map