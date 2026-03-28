"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
exports.DashboardController = {
    getDashboardStats: async (req, res) => {
        try {
            const stats = await dashboard_service_1.DashboardService.getDashboardStats();
            res.status(200).json({
                success: true,
                message: "Dashboard statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            console.error("Error fetching dashboard stats:", error);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve dashboard statistics",
                error: error.message,
            });
        }
    },
    getUserDashboardStats: async (req, res) => {
        try {
            console.log("=== GET USER DASHBOARD STATS API CALLED ===");
            const userId = req.user?.id;
            const userRole = req.user?.role;
            console.log("User ID from token:", userId);
            console.log("User Role from token:", userRole);
            if (!userId) {
                console.error("❌ No user ID found in request!");
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
            }
            const stats = await dashboard_service_1.DashboardService.getUserDashboardStats(userId);
            console.log("✅ Stats retrieved successfully for user:", userId);
            res.status(200).json({
                success: true,
                message: "User dashboard statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            console.error("❌ Error fetching user dashboard stats:", error);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve user dashboard statistics",
                error: error.message,
            });
        }
    },
};
//# sourceMappingURL=dashboard.controller.js.map