"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const validateParams_1 = __importDefault(require("../../middlewares/validateParams"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = (0, express_1.Router)();
// Admin-only routes for create, update, and delete
router.post("/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.debugReviewUpload, upload_1.uploadReviewFields, (0, zodValidation_1.default)(review_validation_1.ReviewValidation.createReviewSchema), review_controller_1.ReviewController.createReviewController);
// Public routes for reading reviews
router.get("/get-all", review_controller_1.ReviewController.getAllReviewController);
router.get("/get-single/:id", (0, validateParams_1.default)(review_validation_1.ReviewValidation.idParamSchema), review_controller_1.ReviewController.getSingleReviewController);
// Admin-only routes for update and delete
router.put("/update/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, validateParams_1.default)(review_validation_1.ReviewValidation.idParamSchema), upload_1.debugReviewUpload, upload_1.uploadReviewFields, (0, zodValidation_1.default)(review_validation_1.ReviewValidation.updateReviewSchema), review_controller_1.ReviewController.updateReviewController);
router.delete("/delete/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, validateParams_1.default)(review_validation_1.ReviewValidation.idParamSchema), review_controller_1.ReviewController.deleteReviewController);
router.put("/reorder", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), review_controller_1.ReviewController.reorderReviewsController);
exports.ReviewRoutes = router;
//# sourceMappingURL=review.routes.js.map