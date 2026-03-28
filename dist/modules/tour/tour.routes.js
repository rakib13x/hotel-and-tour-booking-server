"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminMiddleware_1 = __importDefault(require("../../middlewares/adminMiddleware"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const upload_1 = require("../../middlewares/upload");
const zodValidation_1 = __importDefault(require("../../middlewares/zodValidation"));
const tour_zod_1 = require("../../validators/tour.zod");
const tour_controller_1 = __importDefault(require("./tour.controller"));
const router = express_1.default.Router();
// Middleware to parse JSON strings from form-data
const parseFormDataArrays = (req, res, next) => {
    // Parse JSON strings for arrays (form-data sends arrays as strings)
    if (typeof req.body.tags === "string") {
        try {
            req.body.tags = JSON.parse(req.body.tags);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    if (typeof req.body.highlights === "string") {
        try {
            req.body.highlights = JSON.parse(req.body.highlights);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    if (typeof req.body.inclusion === "string") {
        try {
            req.body.inclusion = JSON.parse(req.body.inclusion);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    if (typeof req.body.exclusion === "string") {
        try {
            req.body.exclusion = JSON.parse(req.body.exclusion);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    if (typeof req.body.galleryUrls === "string") {
        try {
            req.body.galleryUrls = JSON.parse(req.body.galleryUrls);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    if (typeof req.body.galleryIds === "string") {
        try {
            req.body.galleryIds = JSON.parse(req.body.galleryIds);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    if (typeof req.body.seasonalPrices === "string") {
        try {
            req.body.seasonalPrices = JSON.parse(req.body.seasonalPrices);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    if (typeof req.body.itinerary === "string") {
        try {
            req.body.itinerary = JSON.parse(req.body.itinerary);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    if (typeof req.body.seo === "string") {
        try {
            req.body.seo = JSON.parse(req.body.seo);
        }
        catch (error) {
            // Keep as string for validation
        }
    }
    next();
};
// Public routes (no authentication required)
router.get("/", tour_controller_1.default.getTours);
router.get("/offers", tour_controller_1.default.getToursWithOffers);
router.get("/destinations", tour_controller_1.default.getDestinations);
router.get("/country/:countryId", tour_controller_1.default.getToursByCountry);
router.get("/destination/:destinationId", tour_controller_1.default.getToursByDestination);
router.get("/:id", tour_controller_1.default.getTourById);
// Protected routes (authentication required)
router.use(authMiddleware_1.default);
// Admin only routes
router.use(adminMiddleware_1.default);
// Tour CRUD operations
router.post("/", upload_1.uploadTourFields, parseFormDataArrays, (0, zodValidation_1.default)(tour_zod_1.zCreateTour), tour_controller_1.default.createTour);
router.put("/:id", upload_1.uploadTourFields, parseFormDataArrays, (0, zodValidation_1.default)(tour_zod_1.zUpdateTour), tour_controller_1.default.updateTour);
router.delete("/:id", tour_controller_1.default.deleteTour);
// Destination management routes (admin only)
router.post("/destinations", (0, zodValidation_1.default)(tour_zod_1.zCreateDestination), tour_controller_1.default.createDestination);
router.put("/destinations/:id", (0, zodValidation_1.default)(tour_zod_1.zUpdateDestination), tour_controller_1.default.updateDestination);
router.delete("/destinations/:id", tour_controller_1.default.deleteDestination);
exports.default = router;
//# sourceMappingURL=tour.routes.js.map