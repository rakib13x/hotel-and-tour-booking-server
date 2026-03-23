import express from "express";
import adminMiddleware from "../../middlewares/adminMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
import { uploadTourCategorySingle } from "../../middlewares/upload";
import TourCategoryController from "./tourCategory.controller";

const router = express.Router();

// Public routes
router.get("/active", TourCategoryController.getAllActiveTourCategories);
router.get("/:id", TourCategoryController.getTourCategoryById);
router.get("/", TourCategoryController.getTourCategories);

// Protected routes (Admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  TourCategoryController.createTourCategory
);

router.post(
  "/with-image",
  authMiddleware,
  adminMiddleware,
  uploadTourCategorySingle,
  TourCategoryController.createTourCategoryWithImage
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  TourCategoryController.updateTourCategory
);

router.put(
  "/:id/with-image",
  authMiddleware,
  adminMiddleware,
  uploadTourCategorySingle,
  TourCategoryController.updateTourCategoryWithImage
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  TourCategoryController.deleteTourCategory
);

export default router;
