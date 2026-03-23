import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/zodValidation";
import { PolicyPageController } from "./policyPage.controller";
import { PolicyPageValidation } from "./policyPage.validation";

const router = Router();

// Create new policy page (Admin only)
router.post(
  "/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(PolicyPageValidation.createPolicyPageValidation),
  PolicyPageController.createPolicyPage
);

// Get all policy pages with pagination, search, and filtering (Public)
router.get("/", PolicyPageController.getAllPolicyPages);

// Get policy page by slug (Public)
router.get(
  "/slug/:slug",
  validateRequest(PolicyPageValidation.getPolicyPageBySlugValidation),
  PolicyPageController.getPolicyPageBySlug
);

// Get single policy page by ID (Public)
router.get(
  "/:id",
  validateRequest(PolicyPageValidation.getSinglePolicyPageValidation),
  PolicyPageController.getSinglePolicyPage
);

// Update policy page by ID (Admin only)
router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(PolicyPageValidation.updatePolicyPageValidation),
  PolicyPageController.updatePolicyPage
);

// Delete policy page by ID (Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(PolicyPageValidation.deletePolicyPageValidation),
  PolicyPageController.deletePolicyPage
);

export const PolicyPageRoutes = router;
