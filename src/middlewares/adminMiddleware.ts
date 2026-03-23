import { NextFunction, Request, Response } from "express";
import User from "../modules/auth/auth.model";
import ApiError from "../utils/ApiError";

/**
 * Middleware to check if the authenticated user is an admin
 */
export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user ID from request (set by authMiddleware)
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    console.log("user", user);

    // Check if user is admin
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ApiError(403, "Access denied. Admin privileges required");
    }

    // Add user info to request
    (req as any).admin = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default adminMiddleware;
