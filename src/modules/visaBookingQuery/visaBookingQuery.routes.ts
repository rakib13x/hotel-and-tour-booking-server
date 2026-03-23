import express from "express";
import adminMiddleware from "../../middlewares/adminMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../enums/user";
import validateRequest from "../../middlewares/zodValidation";
import VisaBookingQueryController from "./visaBookingQuery.controller";
import {
  zCreateVisaBookingQuery,
  zUpdateVisaBookingQuery,
} from "./visaBookingQuery.validation";

const router = express.Router();

// Public routes
router.post(
  "/",
  validateRequest(zCreateVisaBookingQuery),
  VisaBookingQueryController.createVisaBookingQuery
);

// User only routes
router.get(
  "/my-queries",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  VisaBookingQueryController.getMyVisaBookingQueries
);

// Protected routes (Admin only)
// Note: We apply admin check only to the routes below
router.get("/", authMiddleware, adminMiddleware, VisaBookingQueryController.getVisaBookingQueries);
router.get("/stats", authMiddleware, adminMiddleware, VisaBookingQueryController.getVisaBookingQueryStats);
router.get("/:id", authMiddleware, adminMiddleware, VisaBookingQueryController.getVisaBookingQueryById);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateRequest(zUpdateVisaBookingQuery),
  VisaBookingQueryController.updateVisaBookingQueryStatus
);
router.delete("/:id", authMiddleware, adminMiddleware, VisaBookingQueryController.deleteVisaBookingQuery);

export default router;
