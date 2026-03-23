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

export const BannerRoutes = router;
