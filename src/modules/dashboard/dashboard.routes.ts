import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import { DashboardController } from "./dashboard.controller";

const router = Router();

// Get dashboard statistics (Admin only)
router.get(
  "/stats",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  DashboardController.getDashboardStats
);

// Get user specific dashboard statistics (User only)
router.get(
  "/user-stats",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  DashboardController.getUserDashboardStats
);

export const DashboardRoutes = router;
