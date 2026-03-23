import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import cleanupUploadedFiles from "../../middlewares/fileCleanup";
import { uploadMultiple } from "../../middlewares/upload";
import productController from "./product.controller";

const router = Router();

// Get product images with transformations (public route)
router.get("/images", productController.getProductImages);

// Upload product images (Admin/Super Admin only)
router.post(
  "/:productId/images",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadMultiple,
  cleanupUploadedFiles,
  productController.uploadProductImages
);

// Delete product images (Admin/Super Admin only)
router.delete(
  "/images",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  productController.deleteProductImages
);

export default router;
