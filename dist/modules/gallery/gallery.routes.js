"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const gallery_controller_1 = require("./gallery.controller");
const gallery_validation_1 = require("./gallery.validation");
const router = (0, express_1.Router)();
// Category Routes
// Create new category (Admin/Super Admin only)
router.post("/categories/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadSingle, (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.createCategoryValidation), gallery_controller_1.GalleryController.createCategory);
// Get all categories with pagination, search, and filtering (Public)
router.get("/categories", gallery_controller_1.GalleryController.getAllCategories);
// Get active categories only (Public)
router.get("/categories/active", gallery_controller_1.GalleryController.getActiveCategories);
// Get single category by ID (Public)
router.get("/categories/:id", (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.getSingleCategoryValidation), gallery_controller_1.GalleryController.getSingleCategory);
// Update category by ID (Admin/Super Admin only)
router.patch("/categories/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadSingle, (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.updateCategoryValidation), gallery_controller_1.GalleryController.updateCategory);
// Delete category by ID (Admin/Super Admin only)
router.delete("/categories/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.deleteCategoryValidation), gallery_controller_1.GalleryController.deleteCategory);
// SubCategory Routes
// Create new subcategory (Admin/Super Admin only)
router.post("/subcategories/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadSingle, (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.createSubCategoryValidation), gallery_controller_1.GalleryController.createSubCategory);
// Get all subcategories with pagination, search, and filtering (Public)
router.get("/subcategories", gallery_controller_1.GalleryController.getAllSubCategories);
// Get subcategories by category ID (Public)
router.get("/subcategories/category/:categoryId", (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.getSubCategoriesByCategoryValidation), gallery_controller_1.GalleryController.getSubCategoriesByCategory);
// Get single subcategory by ID (Public)
router.get("/subcategories/:id", (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.getSingleSubCategoryValidation), gallery_controller_1.GalleryController.getSingleSubCategory);
// Update subcategory by ID (Admin/Super Admin only)
router.patch("/subcategories/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadSingle, (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.updateSubCategoryValidation), gallery_controller_1.GalleryController.updateSubCategory);
// Delete subcategory by ID (Admin/Super Admin only)
router.delete("/subcategories/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.deleteSubCategoryValidation), gallery_controller_1.GalleryController.deleteSubCategory);
// Image Routes
// Create new image (Admin/Super Admin only)
router.post("/images/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadSingle, (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.createImageValidation), gallery_controller_1.GalleryController.createImage);
// Get all images with pagination, search, and filtering (Public)
router.get("/images", gallery_controller_1.GalleryController.getAllImages);
// Get images by subcategory ID (Public)
router.get("/images/subcategory/:subCategoryId", (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.getImagesBySubCategoryValidation), gallery_controller_1.GalleryController.getImagesBySubCategory);
// Get single image by ID (Public)
router.get("/images/:id", (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.getSingleImageValidation), gallery_controller_1.GalleryController.getSingleImage);
// Update image by ID (Admin/Super Admin only)
router.patch("/images/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.updateImageValidation), gallery_controller_1.GalleryController.updateImage);
// Delete image by ID (Admin/Super Admin only)
router.delete("/images/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(gallery_validation_1.GalleryValidation.deleteImageValidation), gallery_controller_1.GalleryController.deleteImage);
exports.GalleryRoutes = router;
//# sourceMappingURL=gallery.routes.js.map