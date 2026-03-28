"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const checkValidID_1 = require("../../utils/checkValidID");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const createUserIntoDB = async (payload) => {
    // Check if user with email already exists
    const existingUser = await auth_model_1.default.findOne({ email: payload.email });
    if (existingUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User with this email already exists");
    }
    const result = await auth_model_1.default.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create user");
    }
    return result;
};
const getAllUsersFromDB = async (query) => {
    const apiFeatures = new pagination_1.default(auth_model_1.default.find(), query);
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
const getSingleUserFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await auth_model_1.default.findById(id).select("-password");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return result;
};
const updateUserIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        // If email is being updated, check if it already exists
        if (payload.email) {
            const existingUser = await auth_model_1.default.findOne({
                email: payload.email,
                _id: { $ne: id },
            });
            if (existingUser) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User with this email already exists");
            }
        }
        const result = await auth_model_1.default.findByIdAndUpdate(id, payload, {
            new: true,
            session,
            runValidators: true,
        }).select("-password");
        if (!result) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        await session.commitTransaction();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
const deleteUserFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await auth_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return result;
};
const changeUserStatusInDB = async (id, status) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await auth_model_1.default.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).select("-password");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return result;
};
const changeUserRoleInDB = async (id, role) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await auth_model_1.default.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select("-password");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return result;
};
const getUserStatsFromDB = async () => {
    const stats = await auth_model_1.default.aggregate([
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
    return (stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        deactiveUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
    });
};
exports.UserService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
    changeUserStatusInDB,
    changeUserRoleInDB,
    getUserStatsFromDB,
};
//# sourceMappingURL=user.service.js.map