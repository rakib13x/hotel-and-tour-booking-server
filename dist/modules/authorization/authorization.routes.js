"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const authorization_controller_1 = require("./authorization.controller");
const authorization_validation_1 = require("./authorization.validation");
const router = (0, express_1.Router)();
// Create new authorization (Admin only)
router.post("/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadAuthorizationArray, (0, zodValidation_1.default)(authorization_validation_1.AuthorizationValidation.createAuthorizationValidation), authorization_controller_1.AuthorizationController.createAuthorization);
// Get all authorizations with pagination, search, and filtering (Public)
router.get("/", authorization_controller_1.AuthorizationController.getAllAuthorizations);
// Get single authorization by ID (Public)
router.get("/:id", (0, zodValidation_1.default)(authorization_validation_1.AuthorizationValidation.getSingleAuthorizationValidation), authorization_controller_1.AuthorizationController.getSingleAuthorization);
// Update authorization by ID (Admin only)
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadAuthorizationArray, (0, zodValidation_1.default)(authorization_validation_1.AuthorizationValidation.updateAuthorizationValidation), authorization_controller_1.AuthorizationController.updateAuthorization);
// Delete authorization by ID (Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(authorization_validation_1.AuthorizationValidation.deleteAuthorizationValidation), authorization_controller_1.AuthorizationController.deleteAuthorization);
exports.AuthorizationRoutes = router;
//# sourceMappingURL=authorization.routes.js.map