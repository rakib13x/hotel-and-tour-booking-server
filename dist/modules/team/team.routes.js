"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const validateParams_1 = __importDefault(require("../../middlewares/validateParams"));
const validateReorder_1 = __importDefault(require("../../middlewares/validateReorder"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const team_controller_1 = require("./team.controller");
const team_validation_1 = require("./team.validation");
const router = (0, express_1.Router)();
// Get all team members (Public)
router.get("/", team_controller_1.TeamController.getAllTeams);
// Get single team member by ID (Public)
router.get("/:id", (0, validateParams_1.default)(team_validation_1.idParamValidation), team_controller_1.TeamController.getTeamById);
// Create team member with image upload (Admin/Super Admin only)
router.post("/", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadTeamSingle, (0, zodValidation_1.default)(team_validation_1.createTeamValidation), team_controller_1.TeamController.createTeam);
// Create team member with image URL (Admin/Super Admin only)
router.post("/with-url", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(team_validation_1.createTeamWithUrlValidation), team_controller_1.TeamController.createTeamWithUrl);
// Upload team image (Admin/Super Admin only)
router.post("/upload-image", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), upload_1.uploadTeamSingle, team_controller_1.TeamController.uploadTeamImage);
// Reorder team members (Admin/Super Admin only)
router.patch("/reorder", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), validateReorder_1.default, team_controller_1.TeamController.reorderTeams);
// Update team member (Admin/Super Admin only)
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, validateParams_1.default)(team_validation_1.idParamValidation), (0, zodValidation_1.default)(team_validation_1.updateTeamValidation), team_controller_1.TeamController.updateTeam);
// Update team member with image (Admin/Super Admin only)
router.patch("/:id/with-image", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, validateParams_1.default)(team_validation_1.idParamValidation), upload_1.uploadTeamSingle, (0, zodValidation_1.default)(team_validation_1.updateTeamWithImageValidation), team_controller_1.TeamController.updateTeamWithImage);
// Delete team member (Admin/Super Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, validateParams_1.default)(team_validation_1.idParamValidation), team_controller_1.TeamController.deleteTeam);
exports.TeamRoutes = router;
//# sourceMappingURL=team.routes.js.map