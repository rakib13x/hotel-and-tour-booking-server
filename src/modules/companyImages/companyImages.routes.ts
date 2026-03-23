import express from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import { uploadCompanyFields } from "../../middlewares/upload";
import { CompanyImagesController } from "./companyImages.controller";

const router = express.Router();

// Get all company images (Public)
router.get("/", CompanyImagesController.getAllCompanyImages);

// Get company images by ID (Public)
router.get("/:id", CompanyImagesController.getCompanyImages);

// Create company images (Admin/Super Admin only)
router.post(
  "/",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadCompanyFields,
  CompanyImagesController.createCompanyImages
);

// Update company images (Admin/Super Admin only)
router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadCompanyFields,
  CompanyImagesController.updateCompanyImages
);

// Delete company images (Admin/Super Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  CompanyImagesController.deleteCompanyImages
);

// Delete specific image from any field (Admin/Super Admin only)
router.delete(
  "/:id/:fieldType",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  CompanyImagesController.deleteSpecificImage
);

export const CompanyImagesRoutes = router;
