import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import {
  debugAfterMulter,
  debugBlogUpload,
  uploadBlogFields,
} from "../../middlewares/upload";
import validateRequest from "../../middlewares/zodValidation";
import { BlogController } from "./blogs.controller";
import { BlogValidation } from "./blogs.validation";
import { CategoryValidation } from "./category.validation";

const router = Router();

// Create new blog (Admin only)
router.post(
  "/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  debugBlogUpload,
  uploadBlogFields,
  debugAfterMulter,
  validateRequest(BlogValidation.createBlogValidation),
  BlogController.createBlog
);

// Get all blogs with pagination, search, and filtering (Public)
router.get("/", BlogController.getAllBlogs);

// Get all categories (Public)
router.get("/categories", BlogController.getAllCategories);

// Debug endpoint to check user role
router.get("/debug-user", auth(), (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: "User info retrieved successfully",
  });
});

// Category Management Routes (Admin only)
router.post(
  "/categories",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CategoryValidation.createCategoryValidation),
  BlogController.createCategory
);

router.get(
  "/categories/:id",
  validateRequest(CategoryValidation.getSingleCategoryValidation),
  BlogController.getSingleCategory
);

router.patch(
  "/categories/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CategoryValidation.updateCategoryValidation),
  BlogController.updateCategory
);

router.delete(
  "/categories/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CategoryValidation.deleteCategoryValidation),
  BlogController.deleteCategory
);

// Get blog statistics (Public)
router.get("/stats", BlogController.getBlogStats);

// Get single blog by ID (Public)
router.get(
  "/:id",
  validateRequest(BlogValidation.getSingleBlogValidation),
  BlogController.getSingleBlog
);

// Update blog by ID (Admin only)
router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadBlogFields,
  validateRequest(BlogValidation.updateBlogValidation),
  BlogController.updateBlog
);

// Delete blog by ID (Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(BlogValidation.deleteBlogValidation),
  BlogController.deleteBlog
);

export const BlogRoutes = router;
