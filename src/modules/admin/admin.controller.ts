import { Request, Response } from "express";
import mongoose from "mongoose";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import User from "../auth/auth.model";

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
}

export default new AdminController();
