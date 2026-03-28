"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const admin_controller_1 = __importDefault(require("./admin.controller"));
const adminMiddleware_1 = __importDefault(require("../../middlewares/adminMiddleware"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const router = (0, express_1.Router)();
// Validation schemas
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        role: zod_1.z.enum(["admin", "user", "super_admin"]).optional(),
    }),
});
const updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").optional(),
        email: zod_1.z.string().email("Invalid email format").optional(),
        role: zod_1.z.enum(["admin", "user", "super_admin"]).optional(),
    }),
});
const changeRoleSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum(["admin", "user", "super_admin"]),
    }),
});
// All admin routes require authentication and admin privileges
router.use(authMiddleware_1.default);
router.use(adminMiddleware_1.default);
// User management routes
router.get("/users", admin_controller_1.default.getAllUsers);
router.get("/users/:id", admin_controller_1.default.getUserById);
router.post("/users", (0, zodValidation_1.default)(createUserSchema), admin_controller_1.default.createUser);
router.patch("/users/:id", (0, zodValidation_1.default)(updateUserSchema), admin_controller_1.default.updateUser);
router.delete("/users/:id", admin_controller_1.default.deleteUser);
router.patch("/users/:id/role", (0, zodValidation_1.default)(changeRoleSchema), admin_controller_1.default.changeUserRole);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map