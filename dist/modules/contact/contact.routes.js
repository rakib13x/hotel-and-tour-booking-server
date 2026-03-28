"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const contact_controller_1 = require("./contact.controller");
const contact_validation_1 = require("./contact.validation");
const router = (0, express_1.Router)();
/**
 * @route POST /api/contact/create
 * @desc Create new contact and send emails
 * @access Public
 */
router.post("/create", (0, zodValidation_1.default)(contact_validation_1.ContactValidation.createContactValidation), contact_controller_1.ContactController.createContact);
/**
 * @route GET /api/contact/all
 * @desc Get all contacts with pagination and search
 * @access Private (Admin only)
 * @query page, limit, sortBy, sortOrder, search
 */
router.get("/all", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), contact_controller_1.ContactController.getAllContacts);
/**
 * @route GET /api/contact/stats
 * @desc Get contact statistics for admin dashboard
 * @access Private (Admin only)
 */
router.get("/stats", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), contact_controller_1.ContactController.getContactStats);
/**
 * @route GET /api/contact/:id
 * @desc Get contact by ID
 * @access Private (Admin only)
 */
router.get("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(contact_validation_1.ContactValidation.getContactByIdValidation), contact_controller_1.ContactController.getContactById);
/**
 * @route DELETE /api/contact/:id
 * @desc Delete contact by ID
 * @access Private (Admin only)
 */
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(contact_validation_1.ContactValidation.getContactByIdValidation), contact_controller_1.ContactController.deleteContactById);
exports.ContactRoutes = router;
//# sourceMappingURL=contact.routes.js.map