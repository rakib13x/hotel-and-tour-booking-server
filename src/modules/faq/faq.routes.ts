import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/zodValidation";
import { FaqController } from "./faq.controller";
import { FaqValidation } from "./faq.validation";

const router = Router();

// Create new FAQ (Admin/Super Admin only)
router.post(
  "/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(FaqValidation.createFaqZodSchema),
  FaqController.createFaq
);

// Get all FAQs with pagination, search, and filtering (Admin/Super Admin only)
router.get(
  "/all",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  FaqController.getAllFaqs
);

// Get FAQ statistics (Admin/Super Admin only)
router.get(
  "/stats",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  FaqController.getFaqStats
);

// Get single FAQ by ID (Admin/Super Admin only)
router.get(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(FaqValidation.faqIdZodSchema),
  FaqController.getSingleFaq
);

// Update FAQ by ID (Admin/Super Admin only)
router.put(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(FaqValidation.faqIdZodSchema),
  validateRequest(FaqValidation.updateFaqZodSchema),
  FaqController.updateFaq
);

// Toggle FAQ status (Admin/Super Admin only)
router.patch(
  "/:id/toggle-status",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(FaqValidation.faqIdZodSchema),
  FaqController.toggleFaqStatus
);

// Delete FAQ by ID (Admin/Super Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(FaqValidation.faqIdZodSchema),
  FaqController.deleteFaq
);

// Reorder FAQs (Admin/Super Admin only)
router.patch(
  "/reorder",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(FaqValidation.reorderFaqsZodSchema),
  FaqController.reorderFaqs
);

// Get active FAQs for public display (Public)
router.get("/", FaqController.getActiveFaqs);

export { router as FaqRoutes };
