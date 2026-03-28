"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyImagesController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const companyImages_service_1 = require("./companyImages.service");
const companyImages_validation_1 = require("./companyImages.validation");
// Helper function to merge existing images with new file paths
const mergeImagesWithFiles = (existingImages, newFilePaths) => {
    const existingImageUrls = Array.isArray(existingImages)
        ? existingImages.filter((item) => typeof item === "string" && item.trim() !== "")
        : [];
    return [...existingImageUrls, ...newFilePaths];
};
/**
 * Create a new company images entry
 */
const createCompanyImages = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    // Handle file uploads
    if (req.files) {
        const files = req.files;
        // Handle affiliation images
        if (files.affiliation && files.affiliation.length > 0) {
            payload.affiliation = files.affiliation.map((file) => file.path);
        }
        // Handle payment accept images
        if (files.paymentAccept && files.paymentAccept.length > 0) {
            payload.paymentAccept = files.paymentAccept.map((file) => file.path);
        }
    }
    const validatedData = companyImages_validation_1.CompanyImagesValidation.createCompanyImagesZodSchema.parse({
        body: payload,
    });
    const result = await companyImages_service_1.CompanyImagesService.createCompanyImagesToDB(validatedData.body);
    (0, sendResponse_1.default)(res, 201, {
        success: true,
        message: "Company images created successfully",
        data: result,
    });
});
/**
 * Get company images by ID
 */
const getCompanyImages = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, 400, {
            success: false,
            message: "ID is required",
        });
    }
    const result = await companyImages_service_1.CompanyImagesService.getCompanyImagesFromDB(id);
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "Company images retrieved successfully",
        data: result,
    });
});
/**
 * Get all company images
 */
const getAllCompanyImages = (0, catchAsync_1.default)(async (req, res) => {
    const result = await companyImages_service_1.CompanyImagesService.getAllCompanyImagesFromDB();
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "All company images retrieved successfully",
        data: result,
    });
});
/**
 * Update company images by ID
 */
const updateCompanyImages = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    if (!id) {
        return (0, sendResponse_1.default)(res, 400, {
            success: false,
            message: "ID is required",
        });
    }
    // Handle file uploads and existing file paths
    const files = req.files;
    // Initialize arrays for final image URLs
    let finalAffiliationImages = [];
    let finalPaymentAcceptImages = [];
    // Handle affiliation images
    // First, collect existing URLs from form data (these are the ones user wants to keep)
    const existingAffiliationUrls = [];
    // Check if affiliation is an array (direct from multer)
    if (Array.isArray(payload.affiliation)) {
        payload.affiliation.forEach((url) => {
            if (typeof url === "string" && url.trim() !== "") {
                existingAffiliationUrls.push(url);
            }
        });
    }
    else if (payload.affiliation === "") {
        // If affiliation is empty string, don't update affiliation field
        // This means user didn't modify affiliation images
        // Set a flag to skip affiliation update
        existingAffiliationUrls.push("PRESERVE_EXISTING");
    }
    else {
        // Fallback: check for affiliation[0], affiliation[1], etc. format
        Object.keys(payload).forEach((key) => {
            if (key.startsWith("affiliation[") && key.endsWith("]")) {
                const url = payload[key];
                if (typeof url === "string" && url.trim() !== "") {
                    existingAffiliationUrls.push(url);
                }
            }
        });
    }
    // Add new file paths from uploaded files
    if (files.affiliation && files.affiliation.length > 0) {
        const newFilePaths = files.affiliation.map((file) => file.path);
        finalAffiliationImages = [...existingAffiliationUrls, ...newFilePaths];
    }
    else {
        finalAffiliationImages = existingAffiliationUrls;
    }
    // Handle payment accept images
    // First, collect existing URLs from form data (these are the ones user wants to keep)
    const existingPaymentAcceptUrls = [];
    // Check if paymentAccept is an array (direct from multer)
    if (Array.isArray(payload.paymentAccept)) {
        payload.paymentAccept.forEach((url) => {
            if (typeof url === "string" && url.trim() !== "") {
                existingPaymentAcceptUrls.push(url);
            }
        });
    }
    else if (payload.paymentAccept === "") {
        // If paymentAccept is empty string, don't update paymentAccept field
        // This means user didn't modify paymentAccept images
        // Set a flag to skip paymentAccept update
        existingPaymentAcceptUrls.push("PRESERVE_EXISTING");
    }
    else {
        // Fallback: check for paymentAccept[0], paymentAccept[1], etc. format
        Object.keys(payload).forEach((key) => {
            if (key.startsWith("paymentAccept[") && key.endsWith("]")) {
                const url = payload[key];
                if (typeof url === "string" && url.trim() !== "") {
                    existingPaymentAcceptUrls.push(url);
                }
            }
        });
    }
    // Add new file paths from uploaded files
    if (files.paymentAccept && files.paymentAccept.length > 0) {
        const newFilePaths = files.paymentAccept.map((file) => file.path);
        finalPaymentAcceptImages = [...existingPaymentAcceptUrls, ...newFilePaths];
    }
    else {
        finalPaymentAcceptImages = existingPaymentAcceptUrls;
    }
    // Update payload with final arrays
    // Only update affiliation if it was actually modified
    if (existingAffiliationUrls.includes("PRESERVE_EXISTING")) {
        // Remove the flag and don't update affiliation field
        delete payload.affiliation;
    }
    else {
        payload.affiliation = finalAffiliationImages;
    }
    // Only update paymentAccept if it was actually modified
    if (existingPaymentAcceptUrls.includes("PRESERVE_EXISTING")) {
        // Remove the flag and don't update paymentAccept field
        delete payload.paymentAccept;
    }
    else {
        payload.paymentAccept = finalPaymentAcceptImages;
    }
    // Validate the processed data
    const validatedData = companyImages_validation_1.CompanyImagesValidation.updateCompanyImagesZodSchema.parse({
        body: payload,
    });
    const result = await companyImages_service_1.CompanyImagesService.updateCompanyImagesToDB(id, validatedData.body);
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "Company images updated successfully",
        data: result,
    });
});
/**
 * Delete company images by ID
 */
const deleteCompanyImages = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, 400, {
            success: false,
            message: "ID is required",
        });
    }
    const result = await companyImages_service_1.CompanyImagesService.deleteCompanyImagesFromDB(id);
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "Company images deleted successfully",
        data: result,
    });
});
/**
 * Delete specific image from any field (affiliation or paymentAccept)
 */
const deleteSpecificImage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const fieldType = req.params.fieldType;
    if (!id) {
        return (0, sendResponse_1.default)(res, 400, {
            success: false,
            message: "ID is required",
        });
    }
    if (!fieldType || !["affiliation", "paymentAccept"].includes(fieldType)) {
        return (0, sendResponse_1.default)(res, 400, {
            success: false,
            message: "Field type must be 'affiliation' or 'paymentAccept'",
        });
    }
    const validatedData = companyImages_validation_1.CompanyImagesValidation.deleteImageZodSchema.parse({
        body: req.body,
    });
    const result = await companyImages_service_1.CompanyImagesService.deleteSpecificImageFromDB(id, fieldType, validatedData.body.imageUrl);
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: `${fieldType} image deleted successfully`,
        data: result,
    });
});
exports.CompanyImagesController = {
    createCompanyImages,
    getCompanyImages,
    getAllCompanyImages,
    updateCompanyImages,
    deleteCompanyImages,
    deleteSpecificImage,
};
//# sourceMappingURL=companyImages.controller.js.map