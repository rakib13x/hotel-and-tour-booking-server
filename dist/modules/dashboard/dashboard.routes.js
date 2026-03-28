"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
// Get dashboard statistics (Admin only)
router.get("/stats", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), dashboard_controller_1.DashboardController.getDashboardStats);
// Get user specific dashboard statistics (User only)
router.get("/user-stats", (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), dashboard_controller_1.DashboardController.getUserDashboardStats);
exports.DashboardRoutes = router;
//# sourceMappingURL=dashboard.routes.js.map