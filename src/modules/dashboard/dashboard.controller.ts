import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export const DashboardController = {
  getDashboardStats: async (req: Request, res: Response) => {
    try {
      const stats = await DashboardService.getDashboardStats();

      res.status(200).json({
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve dashboard statistics",
        error: error.message,
      });
    }
  },

  getUserDashboardStats: async (req: Request, res: Response) => {
    try {
      console.log("=== GET USER DASHBOARD STATS API CALLED ===");
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      console.log("User ID from token:", userId);
      console.log("User Role from token:", userRole);

      if (!userId) {
        console.error("❌ No user ID found in request!");
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const stats = await DashboardService.getUserDashboardStats(userId);
      console.log("✅ Stats retrieved successfully for user:", userId);

      res.status(200).json({
        success: true,
        message: "User dashboard statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      console.error("❌ Error fetching user dashboard stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user dashboard statistics",
        error: error.message,
      });
    }
  },
};
