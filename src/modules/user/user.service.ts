import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "../../utils/ApiError";
import { checkValidID } from "../../utils/checkValidID";
import APIFeatures from "../../utils/pagination";
import User from "../auth/auth.model";
import {
  CreateUserInput,
  IUser,
  UpdateUserInput,
  UserQuery,
} from "./user.interface";

const createUserIntoDB = async (payload: CreateUserInput): Promise<IUser> => {
  // Check if user with email already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "User with this email already exists"
    );
  }

  const result = await User.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create user");
  }

  return result;
};

const getAllUsersFromDB = async (query: UserQuery) => {
  const apiFeatures = new APIFeatures(User.find(), query);

  // Search functionality
  apiFeatures.search(["name", "email", "phone"]);

  // Filter functionality
  apiFeatures.filter();

  // Get pagination info
  const paginationInfo = await apiFeatures.pagination();

  // Execute query
  const result = await apiFeatures.query.select("-password");

  return {
    data: result,
    pagination: {
      page: paginationInfo.currentPage,
      limit: paginationInfo.limit,
      total: paginationInfo.total,
      pages: paginationInfo.totalPages,
    },
  };
};

const getSingleUserFromDB = async (id: string): Promise<IUser | null> => {
  checkValidID(id);
  const result = await User.findById(id).select("-password");
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return result;
};

const updateUserIntoDB = async (
  id: string,
  payload: UpdateUserInput
): Promise<IUser | null> => {
  checkValidID(id);

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    // If email is being updated, check if it already exists
    if (payload.email) {
      const existingUser = await User.findOne({
        email: payload.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "User with this email already exists"
        );
      }
    }

    const result = await User.findByIdAndUpdate(id, payload, {
      new: true,
      session,
      runValidators: true,
    }).select("-password");

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const deleteUserFromDB = async (id: string): Promise<IUser | null> => {
  checkValidID(id);
  const result = await User.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return result;
};

const changeUserStatusInDB = async (
  id: string,
  status: "active" | "block" | "deactive"
): Promise<IUser | null> => {
  checkValidID(id);
  const result = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).select("-password");

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return result;
};

const changeUserRoleInDB = async (
  id: string,
  role: "user" | "admin" | "super_admin"
): Promise<IUser | null> => {
  checkValidID(id);
  const result = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return result;
};

const getUserStatsFromDB = async () => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
        blockedUsers: {
          $sum: { $cond: [{ $eq: ["$status", "block"] }, 1, 0] },
        },
        deactiveUsers: {
          $sum: { $cond: [{ $eq: ["$status", "deactive"] }, 1, 0] },
        },
        adminUsers: {
          $sum: {
            $cond: [{ $in: ["$role", ["admin", "super_admin"]] }, 1, 0],
          },
        },
        regularUsers: {
          $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      blockedUsers: 0,
      deactiveUsers: 0,
      adminUsers: 0,
      regularUsers: 0,
    }
  );
};

export const UserService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  changeUserStatusInDB,
  changeUserRoleInDB,
  getUserStatsFromDB,
};
