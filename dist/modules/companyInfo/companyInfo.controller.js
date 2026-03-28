"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyInfoController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const companyInfo_service_1 = require("./companyInfo.service");
const companyInfo_validation_1 = require("./companyInfo.validation");
/**
 * Create a new company information entry
 */
const createCompanyInfo = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    // Parse JSON strings from FormData
    if (typeof payload.email === "string") {
        payload.email = JSON.parse(payload.email);
    }
    if (typeof payload.phone === "string") {
        payload.phone = JSON.parse(payload.phone);
    }
    if (typeof payload.socialLinks === "string") {
        payload.socialLinks = JSON.parse(payload.socialLinks);
    }
    if (typeof payload.openingHours === "string") {
        payload.openingHours = payload.openingHours;
    }
    if (payload.yearsOfExperience) {
        payload.yearsOfExperience = Number(payload.yearsOfExperience);
    }
    // Handle file uploads
    if (req.files) {
        const files = req.files;
        // Handle logo
        if (files.logo && files.logo[0]) {
            payload.logo = files.logo[0].path;
        }
        else if (payload.logo &&
            typeof payload.logo === "object" &&
            payload.logo.path) {
            payload.logo = payload.logo.path;
        }
    }
    else {
        // Handle cases where no new files are uploaded but existing paths are sent as objects
        if (payload.logo && typeof payload.logo === "object" && payload.logo.path) {
            payload.logo = payload.logo.path;
        }
    }
    const validatedData = companyInfo_validation_1.CompanyInfoValidation.createCompanyInfoZodSchema.parse({
        body: payload,
    });
    const result = await companyInfo_service_1.CompanyInfoService.createCompanyInfoToDB(validatedData.body);
    (0, sendResponse_1.default)(res, 201, {
        success: true,
        message: "Company information created successfully",
        data: result,
    });
});
/**
 * Get company information by ID
 */
const getCompanyInfo = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await companyInfo_service_1.CompanyInfoService.getCompanyInfoFromDB(id);
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "Company information retrieved successfully",
        data: result,
    });
});
/**
 * Get all company information entries
 */
const getAllCompanyInfo = (0, catchAsync_1.default)(async (req, res) => {
    const result = await companyInfo_service_1.CompanyInfoService.getCompanyInfoFromDB();
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "All company information retrieved successfully",
        data: result,
    });
});
/**
 * Update company information by ID
 */
const updateCompanyInfo = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    if (!id) {
        return (0, sendResponse_1.default)(res, 400, {
            success: false,
            message: "ID is required",
        });
    }
    // Parse JSON strings from FormData
    if (typeof payload.email === "string") {
        payload.email = JSON.parse(payload.email);
    }
    if (typeof payload.phone === "string") {
        payload.phone = JSON.parse(payload.phone);
    }
    if (typeof payload.socialLinks === "string") {
        payload.socialLinks = JSON.parse(payload.socialLinks);
    }
    if (typeof payload.openingHours === "string") {
        payload.openingHours = payload.openingHours;
    }
    if (payload.yearsOfExperience) {
        payload.yearsOfExperience = Number(payload.yearsOfExperience);
    }
    console.log("=== COMPANY INFO UPDATE DEBUG ===");
    console.log("Request headers:", req.headers);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Files received:", req.files);
    console.log("File received:", req.file);
    console.log("Payload before file handling:", payload);
    console.log("Payload logo before processing:", payload.logo);
    console.log("Payload logo type:", typeof payload.logo);
    // Debug multer errors
    if (req.file) {
        console.log("✅ File received successfully:", req.file);
    }
    else {
        console.log("❌ No file received by multer");
    }
    // Handle file uploads
    if (req.file) {
        // New file uploaded - use the Cloudinary URL
        console.log("Setting new logo path from req.file:", req.file.path);
        payload.logo = req.file.path;
        console.log("New logo path set:", payload.logo);
    }
    else if (req.files) {
        const files = req.files;
        console.log("Files object:", files);
        // Handle logo - only if new file is uploaded
        if (files.logo && files.logo[0]) {
            payload.logo = files.logo[0].path;
            console.log("New logo path set:", payload.logo);
        }
    }
    // Handle logo field from form data
    if (payload.logo === "") {
        // Empty string means user wants to remove logo
        console.log("Empty logo string, removing logo");
        payload.logo = "";
    }
    else if (!req.file && (!req.files || !req.files.logo)) {
        // No new file uploaded, check if we should preserve existing or update with provided URL
        if (typeof payload.logo === "string" && payload.logo.trim() !== "") {
            console.log("Existing logo URL provided:", payload.logo);
            // Keep the existing logo URL from form data
        }
        else {
            // No logo changes, preserve existing logo
            console.log("No logo changes, preserving existing logo");
            delete payload.logo;
        }
    }
    // If new file is uploaded, the new path is already set above and will override any existing URL
    console.log("Final payload:", payload);
    console.log("Final payload logo:", payload.logo);
    // Validate the processed data
    const validatedData = companyInfo_validation_1.CompanyInfoValidation.updateCompanyInfoZodSchema.parse({
        body: payload,
    });
    const result = await companyInfo_service_1.CompanyInfoService.updateCompanyInfoToDB(id, validatedData.body);
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "Company information updated successfully",
        data: result,
    });
});
/**
 * Delete company information by ID
 */
const deleteCompanyInfo = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, 400, {
            success: false,
            message: "ID is required",
        });
    }
    const result = await companyInfo_service_1.CompanyInfoService.deleteCompanyInfoFromDB(id);
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "Company information deleted successfully",
        data: result,
    });
});
exports.CompanyInfoController = {
    createCompanyInfo,
    getCompanyInfo,
    getAllCompanyInfo,
    updateCompanyInfo,
    deleteCompanyInfo,
};
//# sourceMappingURL=companyInfo.controller.js.map