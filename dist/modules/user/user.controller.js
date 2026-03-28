"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const rolePermissions_1 = require("../../utils/rolePermissions");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const user_service_1 = require("./user.service");
class UserController {
    constructor() {
        // Create a new user
        this.createUser = (0, catchAsync_1.default)(async (req, res) => {
            const currentAdmin = req.admin;
            const { role = "user" } = req.body;
            // Check permission to create user with this role
            if (!(0, rolePermissions_1.canCreateUserWithRole)(currentAdmin.role, role)) {
                throw new ApiError_1.default(403, `You don't have permission to create users with role: ${role}`);
            }
            const result = await user_service_1.UserService.createUserIntoDB(req.body);
            (0, sendResponse_1.default)(res, 201, {
                success: true,
                message: "User created successfully",
                data: result,
            });
        });
        // Get all users with pagination and filtering
        this.getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
            const result = await user_service_1.UserService.getAllUsersFromDB(req.query);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Users retrieved successfully",
                data: result.data,
                pagination: result.pagination,
            });
        });
        // Get single user by ID
        this.getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const result = await user_service_1.UserService.getSingleUserFromDB(id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User retrieved successfully",
                data: result,
            });
        });
        // Update user
        this.updateUser = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const currentAdmin = req.admin;
            const { role } = req.body;
            if (!id) {
                throw new ApiError_1.default(400, "User ID is required");
            }
            // Get target user
            const targetUser = await auth_model_1.default.findById(id);
            if (!targetUser) {
                throw new ApiError_1.default(404, "User not found");
            }
            // Check permission to update this user
            const permissionCheck = (0, rolePermissions_1.canUpdateUser)(currentAdmin.role, id, currentAdmin._id.toString(), targetUser.role, role);
            if (!permissionCheck.allowed) {
                throw new ApiError_1.default(403, permissionCheck.message);
            }
            const result = await user_service_1.UserService.updateUserIntoDB(id, req.body);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User updated successfully",
                data: result,
            });
        });
        // Delete user
        this.deleteUser = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const currentAdmin = req.admin;
            if (!id) {
                throw new ApiError_1.default(400, "User ID is required");
            }
            // Get target user
            const targetUser = await auth_model_1.default.findById(id);
            if (!targetUser) {
                throw new ApiError_1.default(404, "User not found");
            }
            // Check permission to delete this user
            const permissionCheck = (0, rolePermissions_1.canDeleteUser)(currentAdmin.role, id, currentAdmin._id.toString(), targetUser.role);
            if (!permissionCheck.allowed) {
                throw new ApiError_1.default(403, permissionCheck.message);
            }
            await user_service_1.UserService.deleteUserFromDB(id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User deleted successfully",
            });
        });
        // Change user status
        this.changeUserStatus = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const { status } = req.body;
            const result = await user_service_1.UserService.changeUserStatusInDB(id, status);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User status updated successfully",
                data: result,
            });
        });
        // Change user role
        this.changeUserRole = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const { role } = req.body;
            const currentAdmin = req.admin;
            if (!id) {
                throw new ApiError_1.default(400, "User ID is required");
            }
            // Get target user
            const targetUser = await auth_model_1.default.findById(id);
            if (!targetUser) {
                throw new ApiError_1.default(404, "User not found");
            }
            // Check permission to change this user's role
            const permissionCheck = (0, rolePermissions_1.canUpdateUser)(currentAdmin.role, id, currentAdmin._id.toString(), targetUser.role, role);
            if (!permissionCheck.allowed) {
                throw new ApiError_1.default(403, permissionCheck.message);
            }
            const result = await user_service_1.UserService.changeUserRoleInDB(id, role);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User role updated successfully",
                data: result,
            });
        });
        // Get user statistics
        this.getUserStats = (0, catchAsync_1.default)(async (req, res) => {
            const result = await user_service_1.UserService.getUserStatsFromDB();
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User statistics retrieved successfully",
                data: result,
            });
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map