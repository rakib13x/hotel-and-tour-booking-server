import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import {
  debugReviewUpload,
  uploadReviewFields,
} from "../../middlewares/upload";
import validateParams from "../../middlewares/validateParams";
import zodValidate from "../../middlewares/zodValidation";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = Router();

// Admin-only routes for create, update, and delete
router.post(
  "/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  debugReviewUpload,
  uploadReviewFields,
  zodValidate(ReviewValidation.createReviewSchema),
  ReviewController.createReviewController
);

// Public routes for reading reviews
router.get("/get-all", ReviewController.getAllReviewController);
router.get(
  "/get-single/:id",
  validateParams(ReviewValidation.idParamSchema),
  ReviewController.getSingleReviewController
);

// Admin-only routes for update and delete
router.put(
  "/update/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateParams(ReviewValidation.idParamSchema),
  debugReviewUpload,
  uploadReviewFields,
  zodValidate(ReviewValidation.updateReviewSchema),
  ReviewController.updateReviewController
);

router.delete(
  "/delete/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateParams(ReviewValidation.idParamSchema),
  ReviewController.deleteReviewController
);

router.put(
  "/reorder",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  ReviewController.reorderReviewsController
);

export const ReviewRoutes = router;
