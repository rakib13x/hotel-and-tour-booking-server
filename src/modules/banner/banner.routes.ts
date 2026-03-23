import { Router } from "express";
import { uploadBannerArray } from "../../middlewares/upload";
import validateRequest from "../../middlewares/zodValidation";
import { BannerController } from "./banner.controller";
import { BannerValidation } from "./banner.validation";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../enums/user";

const router = Router();

// Create new banner (Admin only)
router.post(
  "/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadBannerArray,
  validateRequest(BannerValidation.createBannerWithJsonValidation),
  BannerController.createBanner,
);

// Get all banners with pagination, search, and filtering (Public)
router.get("/", BannerController.getAllBanners);

// Get active banners only (Public)
router.get("/active", BannerController.getActiveBanners);

// Get single banner by ID (Public)
router.get(
  "/:id",
  validateRequest(BannerValidation.getSingleBannerValidation),
  BannerController.getSingleBanner,
);

// Update banner by ID (Admin only)
router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadBannerArray,
  validateRequest(BannerValidation.updateBannerWithJsonValidation),
  BannerController.updateBanner,
);

// Delete banner by ID (Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(BannerValidation.deleteBannerValidation),
  BannerController.deleteBanner,
);

// Toggle banner status (Admin only)
router.patch(
  "/:id/status",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  BannerController.toggleBannerStatus,
);

export const BannerRoutes = router;
