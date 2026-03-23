import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/zodValidation";
import { ContactController } from "./contact.controller";
import { ContactValidation } from "./contact.validation";

const router = Router();

/**
 * @route POST /api/contact/create
 * @desc Create new contact and send emails
 * @access Public
 */
router.post(
  "/create",
  validateRequest(ContactValidation.createContactValidation),
  ContactController.createContact
);

/**
 * @route GET /api/contact/all
 * @desc Get all contacts with pagination and search
 * @access Private (Admin only)
 * @query page, limit, sortBy, sortOrder, search
 */
router.get(
  "/all",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  ContactController.getAllContacts
);

/**
 * @route GET /api/contact/stats
 * @desc Get contact statistics for admin dashboard
 * @access Private (Admin only)
 */
router.get(
  "/stats",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  ContactController.getContactStats
);

/**
 * @route GET /api/contact/:id
 * @desc Get contact by ID
 * @access Private (Admin only)
 */
router.get(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(ContactValidation.getContactByIdValidation),
  ContactController.getContactById
);

/**
 * @route DELETE /api/contact/:id
 * @desc Delete contact by ID
 * @access Private (Admin only)
 */
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(ContactValidation.getContactByIdValidation),
  ContactController.deleteContactById
);

export const ContactRoutes = router;
