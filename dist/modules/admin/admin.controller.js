"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const rolePermissions_1 = require("../../utils/rolePermissions");
class AdminController {
    constructor() {
        // Get all users
        this.getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
            const { page = 1, limit = 10, search = "" } = req.query;
            const query = {};
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ];
            }
            const users = await auth_model_1.default.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(Number(limit) * 1)
                .skip((Number(page) - 1) * Number(limit));
            const total = await auth_model_1.default.countDocuments(query);
            (0, sendResponse_1.default)(res, 200, {
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
        this.getUserById = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(400, "Invalid user ID");
            }
            const user = await auth_model_1.default.findById(id).select("-password");
            if (!user) {
                throw new ApiError_1.default(404, "User not found");
            }
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User retrieved successfully",
                data: user,
            });
        });
        // Create new user
        this.createUser = (0, catchAsync_1.default)(async (req, res) => {
            const { name, email, password, role = "user" } = req.body;
            const currentAdmin = req.admin;
            // Check permission to create user with this role
            if (!(0, rolePermissions_1.canCreateUserWithRole)(currentAdmin.role, role)) {
                throw new ApiError_1.default(403, `You don't have permission to create users with role: ${role}`);
            }
            // Check if user already exists
            const existingUser = await auth_model_1.default.findOne({ email });
            if (existingUser) {
                throw new ApiError_1.default(400, "User with this email already exists");
            }
            const user = await auth_model_1.default.create({
                name,
                email,
                password,
                role,
            });
            // Remove password from response
            const userResponse = user.toObject();
            const { password: _, ...userWithoutPassword } = userResponse;
            (0, sendResponse_1.default)(res, 201, {
                success: true,
                message: "User created successfully",
                data: userWithoutPassword,
            });
        });
        // Update user
        this.updateUser = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const { name, email, role } = req.body;
            const currentAdmin = req.admin;
            if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(400, "Invalid user ID");
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
            // Check if email is being changed and if it already exists
            if (email) {
                const existingUser = await auth_model_1.default.findOne({ email, _id: { $ne: id } });
                if (existingUser) {
                    throw new ApiError_1.default(400, "User with this email already exists");
                }
            }
            const updatedUser = await auth_model_1.default.findByIdAndUpdate(id, { name, email, role }, { new: true, runValidators: true }).select("-password");
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User updated successfully",
                data: updatedUser,
            });
        });
        // Delete user
        this.deleteUser = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const currentAdmin = req.admin;
            if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(400, "Invalid user ID");
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
            await auth_model_1.default.findByIdAndDelete(id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User deleted successfully",
            });
        });
        // Get admin dashboard stats
        this.getDashboardStats = (0, catchAsync_1.default)(async (req, res) => {
            const totalUsers = await auth_model_1.default.countDocuments();
            const totalAdmins = await auth_model_1.default.countDocuments({
                role: { $in: ["admin", "super_admin"] },
            });
            const totalRegularUsers = await auth_model_1.default.countDocuments({ role: "user" });
            // Get recent users (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentUsers = await auth_model_1.default.countDocuments({
                createdAt: { $gte: sevenDaysAgo },
            });
            (0, sendResponse_1.default)(res, 200, {
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
        this.changeUserRole = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const { role } = req.body;
            const currentAdmin = req.admin;
            if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(400, "Invalid user ID");
            }
            if (!["admin", "user", "super_admin"].includes(role)) {
                throw new ApiError_1.default(400, "Invalid role. Must be admin, user, or super_admin");
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
            const updatedUser = await auth_model_1.default.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select("-password");
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "User role updated successfully",
                data: updatedUser,
            });
        });
        // Get allowed roles for current admin (for frontend dropdown)
        this.getAllowedRoles = (0, catchAsync_1.default)(async (req, res) => {
            const currentAdmin = req.admin;
            const allowedRoles = (0, rolePermissions_1.getAllowedRolesForCreation)(currentAdmin.role);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Allowed roles retrieved successfully",
                data: {
                    allowedRoles,
                    currentUserRole: currentAdmin.role,
                },
            });
        });
    }
}
exports.default = new AdminController();
//# sourceMappingURL=admin.controller.js.map