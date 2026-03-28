"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryVisaRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const visa_controller_1 = require("./visa.controller");
const visa_validation_1 = require("./visa.validation");
const router = (0, express_1.Router)();
// Create new country visa (Admin only)
router.post("/create", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(visa_validation_1.CountryVisaValidation.createCountryVisaValidation), visa_controller_1.CountryVisaController.createCountryVisa);
// Get all country visas with pagination, search, and filtering (Public)
router.get("/", visa_controller_1.CountryVisaController.getAllCountryVisas);
// Get active country visas only (Public)
router.get("/active", visa_controller_1.CountryVisaController.getActiveCountryVisas);
// Get country visas by visa type (Public)
router.get("/type/:visaType", (0, zodValidation_1.default)(visa_validation_1.CountryVisaValidation.getCountryVisasByVisaTypeValidation), visa_controller_1.CountryVisaController.getCountryVisasByVisaType);
// Get single country visa by ID (Public)
router.get("/:id", (0, zodValidation_1.default)(visa_validation_1.CountryVisaValidation.getSingleCountryVisaValidation), visa_controller_1.CountryVisaController.getSingleCountryVisa);
// Get country visa by country name (Public)
router.get("/country/:countryName", (0, zodValidation_1.default)(visa_validation_1.CountryVisaValidation.getCountryVisaByCountryNameValidation), visa_controller_1.CountryVisaController.getCountryVisaByCountryName);
// Update country visa by ID (Admin only)
router.patch("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(visa_validation_1.CountryVisaValidation.updateCountryVisaValidation), visa_controller_1.CountryVisaController.updateCountryVisa);
// Delete country visa by ID (Admin only)
router.delete("/:id", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(visa_validation_1.CountryVisaValidation.deleteCountryVisaValidation), visa_controller_1.CountryVisaController.deleteCountryVisa);
// Toggle country visa status (Admin only)
router.patch("/:id/status", (0, auth_1.default)([user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN]), (0, zodValidation_1.default)(visa_validation_1.CountryVisaValidation.toggleCountryVisaStatusValidation), visa_controller_1.CountryVisaController.toggleCountryVisaStatus);
exports.CountryVisaRoutes = router;
//# sourceMappingURL=visa.routes.js.map