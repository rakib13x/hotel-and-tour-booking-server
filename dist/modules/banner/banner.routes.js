"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRoutes = void 0;
const express_1 = require("express");
const upload_1 = require("../../middlewares/upload");
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const banner_controller_1 = require("./banner.controller");
const banner_validation_1 = require("./banner.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const router = (0, express_1.Router)();
// Create new banner (Admin only)
router.post("/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadBannerArray, (0, zodValidation_1.default)(banner_validation_1.BannerValidation.createBannerWithJsonValidation), banner_controller_1.BannerController.createBanner);
// Get all banners with pagination, search, and filtering (Public)
router.get("/", banner_controller_1.BannerController.getAllBanners);
// Get active banners only (Public)
router.get("/active", banner_controller_1.BannerController.getActiveBanners);
// Get single banner by ID (Public)
router.get("/:id", (0, zodValidation_1.default)(banner_validation_1.BannerValidation.getSingleBannerValidation), banner_controller_1.BannerController.getSingleBanner);
// Update banner by ID (Admin only)
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadBannerArray, (0, zodValidation_1.default)(banner_validation_1.BannerValidation.updateBannerWithJsonValidation), banner_controller_1.BannerController.updateBanner);
// Delete banner by ID (Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(banner_validation_1.BannerValidation.deleteBannerValidation), banner_controller_1.BannerController.deleteBanner);
// Toggle banner status (Admin only)
router.patch("/:id/status", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), banner_controller_1.BannerController.toggleBannerStatus);
exports.BannerRoutes = router;
//# sourceMappingURL=banner.routes.js.map