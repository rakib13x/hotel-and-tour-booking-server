import { Request, Response } from "express";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import {
  canCreateUserWithRole,
  canDeleteUser,
  canUpdateUser,
} from "../../utils/rolePermissions";
import sendResponse from "../../utils/sendResponse";
import User from "../auth/auth.model";
import { UserService } from "./user.service";

class UserController {
  // Create a new user
  createUser = catchAsync(async (req: Request, res: Response) => {
    const currentAdmin = (req as any).admin;
    const { role = "user" } = req.body;

    // Check permission to create user with this role
    if (!canCreateUserWithRole(currentAdmin.role, role)) {
      throw new ApiError(
        403,
        `You don't have permission to create users with role: ${role}`
      );
    }

    const result = await UserService.createUserIntoDB(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "User created successfully",
      data: result,
    });
  });

  // Get all users with pagination and filtering
  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsersFromDB(req.query);
    sendResponse(res, 200, {
      success: true,
      message: "Users retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  });

  // Get single user by ID
  getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await UserService.getSingleUserFromDB(id as string);
    sendResponse(res, 200, {
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  });

  // Update user
  updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const currentAdmin = (req as any).admin;
    const { role } = req.body;

    if (!id) {
      throw new ApiError(400, "User ID is required");
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
      role
    );

    if (!permissionCheck.allowed) {
      throw new ApiError(403, permissionCheck.message);
    }

    const result = await UserService.updateUserIntoDB(id as string, req.body);
    sendResponse(res, 200, {
      success: true,
      message: "User updated successfully",
      data: result,
    });
  });

  // Delete user
  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const currentAdmin = (req as any).admin;

    if (!id) {
      throw new ApiError(400, "User ID is required");
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
      targetUser.role
    );

    if (!permissionCheck.allowed) {
      throw new ApiError(403, permissionCheck.message);
    }

    await UserService.deleteUserFromDB(id as string);
    sendResponse(res, 200, {
      success: true,
      message: "User deleted successfully",
    });
  });

  // Change user status
  changeUserStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;
    const result = await UserService.changeUserStatusInDB(id as string, status);
    sendResponse(res, 200, {
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  });

  // Change user role
  changeUserRole = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { role } = req.body;
    const currentAdmin = (req as any).admin;

    if (!id) {
      throw new ApiError(400, "User ID is required");
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
      role
    );

    if (!permissionCheck.allowed) {
      throw new ApiError(403, permissionCheck.message);
    }

    const result = await UserService.changeUserRoleInDB(id as string, role);
    sendResponse(res, 200, {
      success: true,
      message: "User role updated successfully",
      data: result,
    });
  });

  // Get user statistics
  getUserStats = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getUserStatsFromDB();
    sendResponse(res, 200, {
      success: true,
      message: "User statistics retrieved successfully",
      data: result,
    });
  });
}

export default new UserController();
