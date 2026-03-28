import express, { NextFunction, Request, Response } from "express";
import adminMiddleware from "../../middlewares/adminMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
import { uploadCountryFields } from "../../middlewares/upload";
import validateRequest from "../../middlewares/validateRequest";
import CountryController from "./country.controller";
const { body } = require("express-validator");

const router = express.Router();

// Middleware to parse form-data
const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  // No need to parse arrays for single image
  next();
};

// Validation rules
const createCountryValidation = [
  body("name").notEmpty().withMessage("Country name is required"),
  body("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string"),
  body("isTop")
    .optional()
    .isBoolean()
    .withMessage("isTop must be a boolean value"),
];

const updateCountryValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Country name cannot be empty"),
  body("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string"),
  body("isTop")
    .optional()
    .isBoolean()
    .withMessage("isTop must be a boolean value"),
];

// Public routes (no authentication required)
router.get("/with-tours", CountryController.getCountriesWithTours);
router.get("/with-visas", CountryController.getCountriesWithVisas);
router.get("/search", CountryController.searchCountries);
router.get("/popular", CountryController.getPopularCountries);
router.get("/top", CountryController.getTopCountries);
router.get("/", CountryController.getCountries);
router.get("/:id([0-9a-fA-F]{24})", CountryController.getCountryById);

// Admin routes (authentication + admin role required)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadCountryFields,
  parseFormData,
  createCountryValidation,
  validateRequest,
  CountryController.createCountry
);

router.patch(
  "/:id([0-9a-fA-F]{24})",
  authMiddleware,
  adminMiddleware,
  uploadCountryFields,
  parseFormData,
  updateCountryValidation,
  validateRequest,
  CountryController.updateCountry
);

router.delete(
  "/:id([0-9a-fA-F]{24})",
  authMiddleware,
  adminMiddleware,
  CountryController.deleteCountry
);

export default router;
