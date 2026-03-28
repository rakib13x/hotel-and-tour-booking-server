"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileCleanup_1 = __importDefault(require("../../middlewares/fileCleanup"));
const upload_1 = require("../../middlewares/upload");
const product_controller_1 = __importDefault(require("./product.controller"));
const router = (0, express_1.Router)();
// Get product images with transformations (public route)
router.get("/images", product_controller_1.default.getProductImages);
// Upload product images (Admin/Super Admin only)
router.post("/:productId/images", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadMultiple, fileCleanup_1.default, product_controller_1.default.uploadProductImages);
// Delete product images (Admin/Super Admin only)
router.delete("/images", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), product_controller_1.default.deleteProductImages);
exports.default = router;
//# sourceMappingURL=product.routes.js.map