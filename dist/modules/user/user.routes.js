"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../../middlewares/adminMiddleware"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.default);
// Admin-only routes
router.post("/", adminMiddleware_1.default, (0, zodValidation_1.default)(user_validation_1.createUserValidation), user_controller_1.default.createUser);
router.get("/stats", adminMiddleware_1.default, user_controller_1.default.getUserStats);
router.patch("/:id/status", adminMiddleware_1.default, (0, zodValidation_1.default)(user_validation_1.changeUserStatusValidation), user_controller_1.default.changeUserStatus);
router.patch("/:id/role", adminMiddleware_1.default, (0, zodValidation_1.default)(user_validation_1.changeUserRoleValidation), user_controller_1.default.changeUserRole);
// Admin and user routes
router.get("/", adminMiddleware_1.default, user_controller_1.default.getAllUsers);
router.get("/:id", adminMiddleware_1.default, (0, zodValidation_1.default)(user_validation_1.getUserValidation), user_controller_1.default.getSingleUser);
router.patch("/:id", adminMiddleware_1.default, (0, zodValidation_1.default)(user_validation_1.updateUserValidation), user_controller_1.default.updateUser);
router.delete("/:id", adminMiddleware_1.default, (0, zodValidation_1.default)(user_validation_1.deleteUserValidation), user_controller_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map