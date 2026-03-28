"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const auth_model_1 = __importDefault(require("./auth.model"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
class AuthService {
    async register(input) {
        const existingUser = await auth_model_1.default.findOne({ email: input.email });
        if (existingUser) {
            throw new ApiError_1.default(400, "Email already registered");
        }
        const user = new auth_model_1.default({ ...input, role: "user" });
        await user.save();
        const token = (0, generateToken_1.default)(user._id.toString(), user.role);
        // Fetch user without password for response
        const userWithoutPassword = await auth_model_1.default.findById(user._id).select("-password");
        return { user: userWithoutPassword, token };
    }
    async login(input) {
        console.log(input, "this is input");
        const user = await auth_model_1.default.findOne({ email: input.email }).select("+password");
        console.log(user);
        if (!user)
            throw new ApiError_1.default(400, "Invalid email or password");
        const isMatch = await user.comparePassword(input.password);
        if (!isMatch)
            throw new ApiError_1.default(400, "Invalid email or password");
        const token = (0, generateToken_1.default)(user._id.toString(), user.role);
        // Fetch user without password for response
        const userWithoutPassword = await auth_model_1.default.findById(user._id).select("-password");
        return { user: userWithoutPassword, token };
    }
    async updateProfile(userId, updateData) {
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // If email is being updated, check if it already exists
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await auth_model_1.default.findOne({
                email: updateData.email,
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User with this email already exists");
            }
        }
        const updatedUser = await auth_model_1.default.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!updatedUser) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        return updatedUser;
    }
    async changePassword(userId, passwordData) {
        const { currentPassword, newPassword } = passwordData;
        const user = await auth_model_1.default.findById(userId).select("+password");
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Current password is incorrect");
        }
        // Update password
        user.password = newPassword;
        await user.save();
        // Return user without password
        const updatedUser = await auth_model_1.default.findById(userId).select("-password");
        return updatedUser;
    }
    // Default admin creation
    async createDefaultAdmin() {
        const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
        const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "admin123";
        const existingAdmin = await auth_model_1.default.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const admin = new auth_model_1.default({
                name: "super_admin",
                email: adminEmail,
                password: adminPassword,
                role: "super_admin",
            });
            await admin.save();
            console.log("✅ Default admin user created");
        }
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map