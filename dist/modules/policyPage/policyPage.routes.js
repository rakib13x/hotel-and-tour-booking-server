"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyPageRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const policyPage_controller_1 = require("./policyPage.controller");
const policyPage_validation_1 = require("./policyPage.validation");
const router = (0, express_1.Router)();
// Create new policy page (Admin only)
router.post("/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(policyPage_validation_1.PolicyPageValidation.createPolicyPageValidation), policyPage_controller_1.PolicyPageController.createPolicyPage);
// Get all policy pages with pagination, search, and filtering (Public)
router.get("/", policyPage_controller_1.PolicyPageController.getAllPolicyPages);
// Get policy page by slug (Public)
router.get("/slug/:slug", (0, zodValidation_1.default)(policyPage_validation_1.PolicyPageValidation.getPolicyPageBySlugValidation), policyPage_controller_1.PolicyPageController.getPolicyPageBySlug);
// Get single policy page by ID (Public)
router.get("/:id", (0, zodValidation_1.default)(policyPage_validation_1.PolicyPageValidation.getSinglePolicyPageValidation), policyPage_controller_1.PolicyPageController.getSinglePolicyPage);
// Update policy page by ID (Admin only)
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(policyPage_validation_1.PolicyPageValidation.updatePolicyPageValidation), policyPage_controller_1.PolicyPageController.updatePolicyPage);
// Delete policy page by ID (Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(policyPage_validation_1.PolicyPageValidation.deletePolicyPageValidation), policyPage_controller_1.PolicyPageController.deletePolicyPage);
exports.PolicyPageRoutes = router;
//# sourceMappingURL=policyPage.routes.js.map