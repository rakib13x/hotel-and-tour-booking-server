import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import { uploadAuthorizationArray } from "../../middlewares/upload";
import validateRequest from "../../middlewares/zodValidation";
import { AuthorizationController } from "./authorization.controller";
import { AuthorizationValidation } from "./authorization.validation";

const router = Router();

// Create new authorization (Admin only)
router.post(
  "/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadAuthorizationArray,
  validateRequest(AuthorizationValidation.createAuthorizationValidation),
  AuthorizationController.createAuthorization
);

// Get all authorizations with pagination, search, and filtering (Public)
router.get("/", AuthorizationController.getAllAuthorizations);

// Get single authorization by ID (Public)
router.get(
  "/:id",
  validateRequest(AuthorizationValidation.getSingleAuthorizationValidation),
  AuthorizationController.getSingleAuthorization
);

// Update authorization by ID (Admin only)
router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  uploadAuthorizationArray,
  validateRequest(AuthorizationValidation.updateAuthorizationValidation),
  AuthorizationController.updateAuthorization
);

// Delete authorization by ID (Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(AuthorizationValidation.deleteAuthorizationValidation),
  AuthorizationController.deleteAuthorization
);

export const AuthorizationRoutes = router;
