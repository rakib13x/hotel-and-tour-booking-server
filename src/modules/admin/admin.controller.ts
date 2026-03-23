import { Request, Response } from "express";
import mongoose from "mongoose";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import User from "../auth/auth.model";
import {
  canCreateUserWithRole,
  canDeleteUser,
  canUpdateUser,
  getAllowedRolesForCreation,
} from "../../utils/rolePermissions";

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

  // Update user
  updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, email, role } = req.body;
    const currentAdmin = (req as any).admin;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    // Get target user
    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    // Check permission to update this user
    const permissionCheck = canUpdateUser(
      currentAdmin.role,
      id,
      currentAdmin._id.toString(),
      targetUser.role,
      role,
    );

    if (!permissionCheck.allowed) {
      throw new ApiError(403, permissionCheck.message);
    }

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true },
    ).select("-password");

    sendResponse(res, 200, {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  });

  // Delete user
  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const currentAdmin = (req as any).admin;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    // Get target user
    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    // Check permission to delete this user
    const permissionCheck = canDeleteUser(
      currentAdmin.role,
      id,
      currentAdmin._id.toString(),
      targetUser.role,
    );

    if (!permissionCheck.allowed) {
      throw new ApiError(403, permissionCheck.message);
    }

    await User.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "User deleted successfully",
    });
  });

  // Get admin dashboard stats
  getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({
      role: { $in: ["admin", "super_admin"] },
    });
    const totalRegularUsers = await User.countDocuments({ role: "user" });

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    sendResponse(res, 200, {
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        recentUsers,
      },
    });
  });

  // Change user role
  changeUserRole = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { role } = req.body;
    const currentAdmin = (req as any).admin;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    if (!["admin", "user", "super_admin"].includes(role)) {
      throw new ApiError(
        400,
        "Invalid role. Must be admin, user, or super_admin",
      );
    }

    // Get target user
    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    // Check permission to change this user's role
    const permissionCheck = canUpdateUser(
      currentAdmin.role,
      id,
      currentAdmin._id.toString(),
      targetUser.role,
      role,
    );

    if (!permissionCheck.allowed) {
      throw new ApiError(403, permissionCheck.message);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    sendResponse(res, 200, {
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  });

  // Get allowed roles for current admin (for frontend dropdown)
  getAllowedRoles = catchAsync(async (req: Request, res: Response) => {
    const currentAdmin = (req as any).admin;
    const allowedRoles = getAllowedRolesForCreation(currentAdmin.role);

    sendResponse(res, 200, {
      success: true,
      message: "Allowed roles retrieved successfully",
      data: {
        allowedRoles,
        currentUserRole: currentAdmin.role,
      },
    });
  });
}

export default new AdminController();
