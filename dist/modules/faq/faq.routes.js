"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const faq_controller_1 = require("./faq.controller");
const faq_validation_1 = require("./faq.validation");
const router = (0, express_1.Router)();
exports.FaqRoutes = router;
// Create new FAQ (Admin/Super Admin only)
router.post("/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(faq_validation_1.FaqValidation.createFaqZodSchema), faq_controller_1.FaqController.createFaq);
// Get all FAQs with pagination, search, and filtering (Admin/Super Admin only)
router.get("/all", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), faq_controller_1.FaqController.getAllFaqs);
// Get FAQ statistics (Admin/Super Admin only)
router.get("/stats", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), faq_controller_1.FaqController.getFaqStats);
// Get single FAQ by ID (Admin/Super Admin only)
router.get("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(faq_validation_1.FaqValidation.faqIdZodSchema), faq_controller_1.FaqController.getSingleFaq);
// Update FAQ by ID (Admin/Super Admin only)
router.put("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(faq_validation_1.FaqValidation.faqIdZodSchema), (0, zodValidation_1.default)(faq_validation_1.FaqValidation.updateFaqZodSchema), faq_controller_1.FaqController.updateFaq);
// Toggle FAQ status (Admin/Super Admin only)
router.patch("/:id/toggle-status", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(faq_validation_1.FaqValidation.faqIdZodSchema), faq_controller_1.FaqController.toggleFaqStatus);
// Delete FAQ by ID (Admin/Super Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(faq_validation_1.FaqValidation.faqIdZodSchema), faq_controller_1.FaqController.deleteFaq);
// Reorder FAQs (Admin/Super Admin only)
router.patch("/reorder", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(faq_validation_1.FaqValidation.reorderFaqsZodSchema), faq_controller_1.FaqController.reorderFaqs);
// Get active FAQs for public display (Public)
router.get("/", faq_controller_1.FaqController.getActiveFaqs);
//# sourceMappingURL=faq.routes.js.map