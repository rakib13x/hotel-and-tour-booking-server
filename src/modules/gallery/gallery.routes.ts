import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import { uploadSingle } from "../../middlewares/upload";
import validateRequest from "../../middlewares/zodValidation";
import { GalleryController } from "./gallery.controller";
import { GalleryValidation } from "./gallery.validation";

const router = Router();

// Category Routes
// Create new category (Admin/Super Admin only)
router.post(
  "/categories/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadSingle,
  validateRequest(GalleryValidation.createCategoryValidation),
  GalleryController.createCategory
);

// Get all categories with pagination, search, and filtering (Public)
router.get("/categories", GalleryController.getAllCategories);

// Get active categories only (Public)
router.get("/categories/active", GalleryController.getActiveCategories);

// Get single category by ID (Public)
router.get(
  "/categories/:id",
  validateRequest(GalleryValidation.getSingleCategoryValidation),
  GalleryController.getSingleCategory
);

// Update category by ID (Admin/Super Admin only)
router.patch(
  "/categories/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadSingle,
  validateRequest(GalleryValidation.updateCategoryValidation),
  GalleryController.updateCategory
);

// Delete category by ID (Admin/Super Admin only)
router.delete(
  "/categories/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(GalleryValidation.deleteCategoryValidation),
  GalleryController.deleteCategory
);

// SubCategory Routes
// Create new subcategory (Admin/Super Admin only)
router.post(
  "/subcategories/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadSingle,
  validateRequest(GalleryValidation.createSubCategoryValidation),
  GalleryController.createSubCategory
);

// Get all subcategories with pagination, search, and filtering (Public)
router.get("/subcategories", GalleryController.getAllSubCategories);

// Get subcategories by category ID (Public)
router.get(
  "/subcategories/category/:categoryId",
  validateRequest(GalleryValidation.getSubCategoriesByCategoryValidation),
  GalleryController.getSubCategoriesByCategory
);

// Get single subcategory by ID (Public)
router.get(
  "/subcategories/:id",
  validateRequest(GalleryValidation.getSingleSubCategoryValidation),
  GalleryController.getSingleSubCategory
);

// Update subcategory by ID (Admin/Super Admin only)
router.patch(
  "/subcategories/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadSingle,
  validateRequest(GalleryValidation.updateSubCategoryValidation),
  GalleryController.updateSubCategory
);

// Delete subcategory by ID (Admin/Super Admin only)
router.delete(
  "/subcategories/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(GalleryValidation.deleteSubCategoryValidation),
  GalleryController.deleteSubCategory
);

// Image Routes
// Create new image (Admin/Super Admin only)
router.post(
  "/images/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadSingle,
  validateRequest(GalleryValidation.createImageValidation),
  GalleryController.createImage
);

// Get all images with pagination, search, and filtering (Public)
router.get("/images", GalleryController.getAllImages);

// Get images by subcategory ID (Public)
router.get(
  "/images/subcategory/:subCategoryId",
  validateRequest(GalleryValidation.getImagesBySubCategoryValidation),
  GalleryController.getImagesBySubCategory
);

// Get single image by ID (Public)
router.get(
  "/images/:id",
  validateRequest(GalleryValidation.getSingleImageValidation),
  GalleryController.getSingleImage
);

// Update image by ID (Admin/Super Admin only)
router.patch(
  "/images/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(GalleryValidation.updateImageValidation),
  GalleryController.updateImage
);

// Delete image by ID (Admin/Super Admin only)
router.delete(
  "/images/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(GalleryValidation.deleteImageValidation),
  GalleryController.deleteImage
);

export const GalleryRoutes = router;
