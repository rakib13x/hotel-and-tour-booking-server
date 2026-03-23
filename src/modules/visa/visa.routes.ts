import { Router } from "express";
import { USER_ROLES } from "../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/zodValidation";
import { CountryVisaController } from "./visa.controller";
import { CountryVisaValidation } from "./visa.validation";

const router = Router();

// Create new country visa (Admin only)
router.post(
  "/create",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CountryVisaValidation.createCountryVisaValidation),
  CountryVisaController.createCountryVisa
);

// Get all country visas with pagination, search, and filtering (Public)
router.get("/", CountryVisaController.getAllCountryVisas);

// Get active country visas only (Public)
router.get("/active", CountryVisaController.getActiveCountryVisas);

// Get country visas by visa type (Public)
router.get(
  "/type/:visaType",
  validateRequest(CountryVisaValidation.getCountryVisasByVisaTypeValidation),
  CountryVisaController.getCountryVisasByVisaType
);

// Get single country visa by ID (Public)
router.get(
  "/:id",
  validateRequest(CountryVisaValidation.getSingleCountryVisaValidation),
  CountryVisaController.getSingleCountryVisa
);

// Get country visa by country name (Public)
router.get(
  "/country/:countryName",
  validateRequest(CountryVisaValidation.getCountryVisaByCountryNameValidation),
  CountryVisaController.getCountryVisaByCountryName
);

// Update country visa by ID (Admin only)
router.patch(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CountryVisaValidation.updateCountryVisaValidation),
  CountryVisaController.updateCountryVisa
);

// Delete country visa by ID (Admin only)
router.delete(
  "/:id",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CountryVisaValidation.deleteCountryVisaValidation),
  CountryVisaController.deleteCountryVisa
);

// Toggle country visa status (Admin only)
router.patch(
  "/:id/status",
  auth([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  validateRequest(CountryVisaValidation.toggleCountryVisaStatusValidation),
  CountryVisaController.toggleCountryVisaStatus
);

export const CountryVisaRoutes = router;
