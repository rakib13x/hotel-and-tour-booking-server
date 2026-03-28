"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
class AuthController {
    constructor() {
        this.register = (0, catchAsync_1.default)(async (req, res) => {
            const { user, token } = await auth_service_1.default.register(req.body);
            res.status(201).json({ success: true, user, token });
        });
        this.login = (0, catchAsync_1.default)(async (req, res) => {
            console.log(req.body);
            const { user, token } = await auth_service_1.default.login(req.body);
            res.status(200).json({ success: true, user, token });
        });
        this.updateProfile = (0, catchAsync_1.default)(async (req, res) => {
            const userId = req.user?.id;
            if (!userId) {
                return (0, sendResponse_1.default)(res, 401, {
                    success: false,
                    message: "User not authenticated",
                });
            }
            const result = await auth_service_1.default.updateProfile(userId, req.body);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Profile updated successfully",
                data: result,
            });
        });
        this.changePassword = (0, catchAsync_1.default)(async (req, res) => {
            const userId = req.user?.id;
            if (!userId) {
                return (0, sendResponse_1.default)(res, 401, {
                    success: false,
                    message: "User not authenticated",
                });
            }
            const result = await auth_service_1.default.changePassword(userId, req.body);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Password changed successfully",
                data: result,
            });
        });
        this.uploadProfileImage = (0, catchAsync_1.default)(async (req, res) => {
            const userId = req.user?.id;
            if (!userId) {
                return (0, sendResponse_1.default)(res, 401, {
                    success: false,
                    message: "User not authenticated",
                });
            }
            // Check if file was uploaded
            if (!req.file) {
                return (0, sendResponse_1.default)(res, 400, {
                    success: false,
                    message: "Profile image file is required",
                });
            }
            // Get image URL from Cloudinary upload
            const imageUrl = req.file.path;
            // Update user profile with new image URL
            const result = await auth_service_1.default.updateProfile(userId, {
                profileImg: imageUrl,
            });
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Profile image uploaded successfully",
                data: result,
            });
        });
        this.googleCallback = (0, catchAsync_1.default)(async (req, res) => {
            const user = req.user;
            console.log(user, "this is user");
            if (!user) {
                // Redirect to frontend with error
                return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/google/callback?error=authentication_failed`);
            }
            // Generate JWT token
            const token = (0, generateToken_1.default)(user._id.toString(), user.role);
            // Prepare user data (exclude sensitive fields)
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImg: user.profileImg,
                status: user.status,
            };
            // Redirect to frontend with token and user data
            const encodedUser = encodeURIComponent(JSON.stringify(userData));
            res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/google/callback?token=${token}&user=${encodedUser}`);
        });
        this.getCurrentUser = (0, catchAsync_1.default)(async (req, res) => {
            const user = req.user;
            res.status(200).json({ success: true, user });
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map