import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import {
  debugAfterMulter,
  debugBlogUpload,
  uploadCorporateClientFields,
} from "../../middlewares/upload";
import validateRequest from "../../middlewares/zodValidation";
import { CorporateClientController } from "./corporateClients.controller";
import { CorporateClientValidation } from "./corporateClients.validation";

const router = Router();

// Create new corporate client (Admin only)
router.post(
  "/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  debugBlogUpload,
  uploadCorporateClientFields,
  debugAfterMulter,
  validateRequest(CorporateClientValidation.createCorporateClientValidation),
  CorporateClientController.createCorporateClient
);

// Get all corporate clients with pagination, search, and filtering (Admin only)
router.get(
  "/",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  CorporateClientController.getAllCorporateClients
);

// Reorder corporate clients (Admin only) - Must be before /:id routes
router.patch(
  "/reorder",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CorporateClientValidation.reorderCorporateClientsValidation),
  CorporateClientController.reorderCorporateClients
);

// Get single corporate client (Admin only)
router.get(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CorporateClientValidation.getSingleCorporateClientValidation),
  CorporateClientController.getSingleCorporateClient
);

// Update corporate client (Admin only)
router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  debugBlogUpload,
  uploadCorporateClientFields,
  debugAfterMulter,
  validateRequest(CorporateClientValidation.updateCorporateClientValidation),
  CorporateClientController.updateCorporateClient
);

// Delete corporate client (Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CorporateClientValidation.deleteCorporateClientValidation),
  CorporateClientController.deleteCorporateClient
);

// Public API for frontend
router.get("/public/all", CorporateClientController.getPublicCorporateClients);

export const CorporateClientRoutes = router;
