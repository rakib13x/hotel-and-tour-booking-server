import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import { uploadTeamSingle } from "../../middlewares/upload";
import validateParams from "../../middlewares/validateParams";
import validateReorder from "../../middlewares/validateReorder";
import validateRequest from "../../middlewares/zodValidation";
import { TeamController } from "./team.controller";
import {
  createTeamValidation,
  createTeamWithUrlValidation,
  idParamValidation,
  updateTeamValidation,
  updateTeamWithImageValidation,
} from "./team.validation";

const router = Router();

// Get all team members (Public)
router.get("/", TeamController.getAllTeams);

// Get single team member by ID (Public)
router.get(
  "/:id",
  validateParams(idParamValidation),
  TeamController.getTeamById
);

// Create team member with image upload (Admin/Super Admin only)
router.post(
  "/",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadTeamSingle,
  validateRequest(createTeamValidation),
  TeamController.createTeam
);

// Create team member with image URL (Admin/Super Admin only)
router.post(
  "/with-url",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(createTeamWithUrlValidation),
  TeamController.createTeamWithUrl
);

// Upload team image (Admin/Super Admin only)
router.post(
  "/upload-image",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadTeamSingle,
  TeamController.uploadTeamImage
);

// Reorder team members (Admin/Super Admin only)
router.patch(
  "/reorder",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateReorder,
  TeamController.reorderTeams
);

// Update team member (Admin/Super Admin only)
router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateParams(idParamValidation),
  validateRequest(updateTeamValidation),
  TeamController.updateTeam
);

// Update team member with image (Admin/Super Admin only)
router.patch(
  "/:id/with-image",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateParams(idParamValidation),
  uploadTeamSingle,
  validateRequest(updateTeamWithImageValidation),
  TeamController.updateTeamWithImage
);

// Delete team member (Admin/Super Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateParams(idParamValidation),
  TeamController.deleteTeam
);

export const TeamRoutes = router;
