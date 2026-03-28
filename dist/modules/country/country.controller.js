"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const country_service_1 = __importDefault(require("./country.service"));
class CountryController {
    constructor() {
        // Create a new country
        this.createCountry = (0, catchAsync_1.default)(async (req, res) => {
            console.log("=== CREATE COUNTRY ===");
            console.log("req.body:", req.body);
            console.log("req.files:", req.files);
            // Handle file uploads - using CloudinaryStorage approach
            if (req.files) {
                const files = req.files;
                // Handle single image
                if (files.image && files.image.length > 0 && files.image[0]) {
                    // With CloudinaryStorage, files have a 'path' property containing the Cloudinary URL
                    req.body.imageUrl = files.image[0].path;
                    console.log("Image uploaded to Cloudinary:", req.body.imageUrl);
                }
                else {
                    console.log("No image found in files.image");
                }
            }
            else {
                console.log("No files received");
            }
            // Convert isTop from string to boolean (FormData sends as string)
            if (req.body.isTop !== undefined) {
                req.body.isTop = req.body.isTop === "true" || req.body.isTop === true;
                console.log("isTop converted to:", req.body.isTop);
            }
            // Validate required fields
            if (!req.body.imageUrl) {
                console.log("ERROR: Image URL not found after processing");
                return (0, sendResponse_1.default)(res, 400, {
                    success: false,
                    message: "Image is required. Please upload an image file.",
                });
            }
            console.log("Final data to save:", req.body);
            const country = await country_service_1.default.createCountry(req.body);
            (0, sendResponse_1.default)(res, 201, {
                success: true,
                message: "Country created successfully",
                data: country,
            });
        });
        // Get all countries with pagination and filtering
        this.getCountries = (0, catchAsync_1.default)(async (req, res) => {
            const options = pagination_1.default.extractPaginationOptions(req);
            // Extract isTop filter parameter
            const isTop = req.query.isTop ? String(req.query.isTop) : undefined;
            const queryOptions = {
                ...options,
                ...(isTop !== undefined && { isTop }),
            };
            const result = await country_service_1.default.getCountries(queryOptions);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Countries retrieved successfully",
                data: result.data,
                pagination: result.pagination,
            });
        });
        // Get country by ID
        this.getCountryById = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            const country = await country_service_1.default.getCountryById(id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Country retrieved successfully",
                data: country,
            });
        });
        // Update country
        this.updateCountry = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            console.log("=== UPDATE COUNTRY ===");
            console.log("Country ID:", id);
            console.log("req.body:", req.body);
            console.log("req.files:", req.files);
            // Handle file uploads - using CloudinaryStorage approach
            if (req.files) {
                const files = req.files;
                // Handle single image
                if (files.image && files.image.length > 0 && files.image[0]) {
                    // With CloudinaryStorage, files have a 'path' property containing the Cloudinary URL
                    req.body.imageUrl = files.image[0].path;
                    console.log("New image uploaded to Cloudinary:", req.body.imageUrl);
                }
            }
            // Convert isTop from string to boolean (FormData sends as string)
            if (req.body.isTop !== undefined) {
                req.body.isTop = req.body.isTop === "true" || req.body.isTop === true;
                console.log("isTop converted to:", req.body.isTop);
            }
            console.log("Final data to update:", req.body);
            const country = await country_service_1.default.updateCountry(id, req.body);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Country updated successfully",
                data: country,
            });
        });
        // Delete country
        this.deleteCountry = (0, catchAsync_1.default)(async (req, res) => {
            const id = req.params.id;
            await country_service_1.default.deleteCountry(id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Country deleted successfully",
            });
        });
        // Get popular countries
        this.getPopularCountries = (0, catchAsync_1.default)(async (req, res) => {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const countries = await country_service_1.default.getPopularCountries(limit);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Popular countries retrieved successfully",
                data: countries,
            });
        });
        // Search countries
        this.searchCountries = (0, catchAsync_1.default)(async (req, res) => {
            const { q } = req.query;
            if (!q) {
                return (0, sendResponse_1.default)(res, 400, {
                    success: false,
                    message: "Search query is required",
                });
            }
            const countries = await country_service_1.default.searchCountries(q);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Search results retrieved successfully",
                data: countries,
            });
        });
        // Get top/featured countries
        this.getTopCountries = (0, catchAsync_1.default)(async (req, res) => {
            const countries = await country_service_1.default.getTopCountries();
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Top countries retrieved successfully",
                data: countries,
            });
        });
        // Get countries with published tours
        this.getCountriesWithTours = (0, catchAsync_1.default)(async (req, res) => {
            console.log("=== GET COUNTRIES WITH TOURS ===");
            const countries = await country_service_1.default.getCountriesWithTours();
            console.log(`Found ${countries.length} countries with tours`);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Countries with tours retrieved successfully",
                data: countries,
            });
        });
        // Get countries with active visas
        this.getCountriesWithVisas = (0, catchAsync_1.default)(async (req, res) => {
            const countries = await country_service_1.default.getCountriesWithVisas();
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Countries with visas retrieved successfully",
                data: countries,
            });
        });
    }
}
exports.default = new CountryController();
//# sourceMappingURL=country.controller.js.map