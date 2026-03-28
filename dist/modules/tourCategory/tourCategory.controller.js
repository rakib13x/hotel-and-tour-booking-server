"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../../services/cloudinary"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tourCategory_service_1 = __importDefault(require("./tourCategory.service"));
class TourCategoryController {
    constructor() {
        // Create tour category without image
        this.createTourCategory = (0, catchAsync_1.default)(async (req, res) => {
            const tourCategory = await tourCategory_service_1.default.createTourCategory(req.body);
            (0, sendResponse_1.default)(res, 201, {
                success: true,
                message: "Tour category created successfully",
                data: tourCategory,
            });
        });
        // Create tour category with image
        this.createTourCategoryWithImage = (0, catchAsync_1.default)(async (req, res) => {
            // Debug logging
            console.log("=== CREATE TOUR CATEGORY WITH IMAGE ===");
            console.log("req.body:", req.body);
            console.log("req.file:", req.file);
            console.log("category_name:", req.body.category_name);
            console.log("description:", req.body.description);
            // Handle file upload - Manual Cloudinary upload with memory storage
            let imageUrl;
            if (req.file && req.file.buffer) {
                console.log("Uploading image to Cloudinary...");
                const uploadResult = await cloudinary_1.default.uploadImage(req.file, {
                    folder: "tour-categories",
                    quality: "auto",
                });
                imageUrl = uploadResult.secure_url;
                console.log("Image uploaded successfully:", imageUrl);
            }
            const tourCategoryData = {
                category_name: req.body.category_name,
            };
            // Add description if it exists and is not empty
            if (req.body.description && req.body.description.trim() !== "") {
                tourCategoryData.description = req.body.description.trim();
            }
            // Only add img if it exists
            if (imageUrl) {
                tourCategoryData.img = imageUrl;
            }
            console.log("Creating tour category with data:", tourCategoryData);
            const tourCategory = await tourCategory_service_1.default.createTourCategory(tourCategoryData);
            (0, sendResponse_1.default)(res, 201, {
                success: true,
                message: "Tour category created successfully with image",
                data: tourCategory,
            });
        });
        // Get all tour categories
        this.getTourCategories = (0, catchAsync_1.default)(async (req, res) => {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search,
            };
            const result = await tourCategory_service_1.default.getTourCategories(options);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Tour categories retrieved successfully",
                data: result.data,
                pagination: result.pagination,
            });
        });
        // Get all active tour categories (for dropdown)
        this.getAllActiveTourCategories = (0, catchAsync_1.default)(async (req, res) => {
            const tourCategories = await tourCategory_service_1.default.getAllActiveTourCategories();
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Active tour categories retrieved successfully",
                data: tourCategories,
            });
        });
        // Get single tour category
        this.getTourCategoryById = (0, catchAsync_1.default)(async (req, res) => {
            const tourCategory = await tourCategory_service_1.default.getTourCategoryById(req.params.id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Tour category retrieved successfully",
                data: tourCategory,
            });
        });
        // Update tour category without image
        this.updateTourCategory = (0, catchAsync_1.default)(async (req, res) => {
            const tourCategory = await tourCategory_service_1.default.updateTourCategory(req.params.id, req.body);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Tour category updated successfully",
                data: tourCategory,
            });
        });
        // Update tour category with image
        this.updateTourCategoryWithImage = (0, catchAsync_1.default)(async (req, res) => {
            // Debug logging
            console.log("=== UPDATE TOUR CATEGORY WITH IMAGE ===");
            console.log("req.body:", req.body);
            console.log("req.file:", req.file);
            console.log("category_name:", req.body.category_name);
            console.log("description:", req.body.description);
            // Handle file upload - Manual Cloudinary upload with memory storage
            let imageUrl;
            if (req.file && req.file.buffer) {
                console.log("Uploading image to Cloudinary...");
                const uploadResult = await cloudinary_1.default.uploadImage(req.file, {
                    folder: "tour-categories",
                    quality: "auto",
                });
                imageUrl = uploadResult.secure_url;
                console.log("Image uploaded successfully:", imageUrl);
            }
            const updateData = {};
            if (req.body.category_name) {
                updateData.category_name = req.body.category_name;
            }
            // Add description if it exists and is not empty
            if (req.body.description && req.body.description.trim() !== "") {
                updateData.description = req.body.description.trim();
            }
            if (imageUrl) {
                updateData.img = imageUrl;
            }
            console.log("Updating tour category with data:", updateData);
            const tourCategory = await tourCategory_service_1.default.updateTourCategory(req.params.id, updateData);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Tour category updated successfully with image",
                data: tourCategory,
            });
        });
        // Delete tour category
        this.deleteTourCategory = (0, catchAsync_1.default)(async (req, res) => {
            await tourCategory_service_1.default.deleteTourCategory(req.params.id);
            (0, sendResponse_1.default)(res, 200, {
                success: true,
                message: "Tour category deleted successfully",
                data: null,
            });
        });
    }
}
exports.default = new TourCategoryController();
//# sourceMappingURL=tourCategory.controller.js.map