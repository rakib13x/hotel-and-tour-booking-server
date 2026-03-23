import { Request, Response } from "express";
import mongoose from "mongoose";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import User from "../auth/auth.model";
import { canCreateUserWithRole } from "../../utils/rolePermissions";

class AdminController {
  // Get all users
  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);

    sendResponse(res, 200, {
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalUsers: total,
          hasNext: Number(page) < Math.ceil(total / Number(limit)),
          hasPrev: Number(page) > 1,
        },
      },
    });
  });

  // Get single user by ID
  getUserById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    sendResponse(res, 200, {
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  });

  // Create new user
  createUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password, role = "user" } = req.body;
    const currentAdmin = (req as any).admin;

    // Check permission to create user with this role
    if (!canCreateUserWithRole(currentAdmin.role, role)) {
      throw new ApiError(
        403,
        `You don't have permission to create users with role: ${role}`,
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Remove password from response
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    sendResponse(res, 201, {
      success: true,
      message: "User created successfully",
      data: userWithoutPassword,
    });
  });
}

export default new AdminController();
