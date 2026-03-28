"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const blogs_controller_1 = require("./blogs.controller");
const blogs_validation_1 = require("./blogs.validation");
const category_validation_1 = require("./category.validation");
const router = (0, express_1.Router)();
// Create new blog (Admin only)
router.post("/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.debugBlogUpload, upload_1.uploadBlogFields, upload_1.debugAfterMulter, (0, zodValidation_1.default)(blogs_validation_1.BlogValidation.createBlogValidation), blogs_controller_1.BlogController.createBlog);
// Get all blogs with pagination, search, and filtering (Public)
router.get("/", blogs_controller_1.BlogController.getAllBlogs);
// Get all categories (Public)
router.get("/categories", blogs_controller_1.BlogController.getAllCategories);
// Debug endpoint to check user role
router.get("/debug-user", (0, auth_1.default)(), (req, res) => {
    res.json({
        success: true,
        user: req.user,
        message: "User info retrieved successfully",
    });
});
// Category Management Routes (Admin only)
router.post("/categories", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(category_validation_1.CategoryValidation.createCategoryValidation), blogs_controller_1.BlogController.createCategory);
router.get("/categories/:id", (0, zodValidation_1.default)(category_validation_1.CategoryValidation.getSingleCategoryValidation), blogs_controller_1.BlogController.getSingleCategory);
router.patch("/categories/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(category_validation_1.CategoryValidation.updateCategoryValidation), blogs_controller_1.BlogController.updateCategory);
router.delete("/categories/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(category_validation_1.CategoryValidation.deleteCategoryValidation), blogs_controller_1.BlogController.deleteCategory);
// Get blog statistics (Public)
router.get("/stats", blogs_controller_1.BlogController.getBlogStats);
// Get single blog by ID (Public)
router.get("/:id", (0, zodValidation_1.default)(blogs_validation_1.BlogValidation.getSingleBlogValidation), blogs_controller_1.BlogController.getSingleBlog);
// Update blog by ID (Admin only)
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadBlogFields, (0, zodValidation_1.default)(blogs_validation_1.BlogValidation.updateBlogValidation), blogs_controller_1.BlogController.updateBlog);
// Delete blog by ID (Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(blogs_validation_1.BlogValidation.deleteBlogValidation), blogs_controller_1.BlogController.deleteBlog);
exports.BlogRoutes = router;
//# sourceMappingURL=blogs.routes.js.map