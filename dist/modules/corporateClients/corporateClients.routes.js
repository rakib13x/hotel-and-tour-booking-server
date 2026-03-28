"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateClientRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const corporateClients_controller_1 = require("./corporateClients.controller");
const corporateClients_validation_1 = require("./corporateClients.validation");
const router = (0, express_1.Router)();
// Create new corporate client (Admin only)
router.post("/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.debugBlogUpload, upload_1.uploadCorporateClientFields, upload_1.debugAfterMulter, (0, zodValidation_1.default)(corporateClients_validation_1.CorporateClientValidation.createCorporateClientValidation), corporateClients_controller_1.CorporateClientController.createCorporateClient);
// Get all corporate clients with pagination, search, and filtering (Admin only)
router.get("/", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), corporateClients_controller_1.CorporateClientController.getAllCorporateClients);
// Reorder corporate clients (Admin only) - Must be before /:id routes
router.patch("/reorder", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(corporateClients_validation_1.CorporateClientValidation.reorderCorporateClientsValidation), corporateClients_controller_1.CorporateClientController.reorderCorporateClients);
// Get single corporate client (Admin only)
router.get("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(corporateClients_validation_1.CorporateClientValidation.getSingleCorporateClientValidation), corporateClients_controller_1.CorporateClientController.getSingleCorporateClient);
// Update corporate client (Admin only)
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.debugBlogUpload, upload_1.uploadCorporateClientFields, upload_1.debugAfterMulter, (0, zodValidation_1.default)(corporateClients_validation_1.CorporateClientValidation.updateCorporateClientValidation), corporateClients_controller_1.CorporateClientController.updateCorporateClient);
// Delete corporate client (Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(corporateClients_validation_1.CorporateClientValidation.deleteCorporateClientValidation), corporateClients_controller_1.CorporateClientController.deleteCorporateClient);
// Public API for frontend
router.get("/public/all", corporateClients_controller_1.CorporateClientController.getPublicCorporateClients);
exports.CorporateClientRoutes = router;
//# sourceMappingURL=corporateClients.routes.js.map