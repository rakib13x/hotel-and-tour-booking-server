"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminMiddleware_1 = __importDefault(require("../../middlewares/adminMiddleware"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const upload_1 = require("../../middlewares/upload");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const country_controller_1 = __importDefault(require("./country.controller"));
const { body } = require("express-validator");
const router = express_1.default.Router();
// Middleware to parse form-data
const parseFormData = (req, res, next) => {
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
router.get("/with-tours", country_controller_1.default.getCountriesWithTours);
router.get("/with-visas", country_controller_1.default.getCountriesWithVisas);
router.get("/search", country_controller_1.default.searchCountries);
router.get("/popular", country_controller_1.default.getPopularCountries);
router.get("/top", country_controller_1.default.getTopCountries);
router.get("/", country_controller_1.default.getCountries);
router.get("/:id([0-9a-fA-F]{24})", country_controller_1.default.getCountryById);
// Admin routes (authentication + admin role required)
router.post("/", authMiddleware_1.default, adminMiddleware_1.default, upload_1.uploadCountryFields, parseFormData, createCountryValidation, validateRequest_1.default, country_controller_1.default.createCountry);
router.patch("/:id([0-9a-fA-F]{24})", authMiddleware_1.default, adminMiddleware_1.default, upload_1.uploadCountryFields, parseFormData, updateCountryValidation, validateRequest_1.default, country_controller_1.default.updateCountry);
router.delete("/:id([0-9a-fA-F]{24})", authMiddleware_1.default, adminMiddleware_1.default, country_controller_1.default.deleteCountry);
exports.default = router;
//# sourceMappingURL=country.routes.js.map