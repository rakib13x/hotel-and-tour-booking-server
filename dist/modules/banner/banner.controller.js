"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const banner_service_1 = require("./banner.service");
const cloudinary_1 = require("../../services/cloudinary");
const createBanner = (0, catchAsync_1.default)(async (req, res) => {
    // Handle file uploads
    const files = req.files;
    const backgroundImageFiles = files || [];
    // Determine if this is FormData or JSON request
    const contentType = req.headers["content-type"];
    const isFormData = contentType && contentType.includes("multipart/form-data");
    // Prepare banner data based on request type
    let bannerData;
    if (isFormData) {
        // For FormData, data is directly in req.body
        // Handle backgroundImage array from FormData
        let backgroundImageArray = [];
        if (req.body.backgroundImage) {
            // If it's a string, split by comma or convert to array
            if (typeof req.body.backgroundImage === "string") {
                backgroundImageArray = req.body.backgroundImage
                    .split(",")
                    .filter((url) => url.trim());
            }
            else if (Array.isArray(req.body.backgroundImage)) {
                backgroundImageArray = req.body.backgroundImage;
            }
        }
        bannerData = {
            title: req.body.title,
            description: req.body.description,
            isActive: req.body.isActive,
            backgroundImage: backgroundImageArray,
        };
    }
    else {
        // For JSON, data is in req.body.body
        bannerData = req.body.body;
    }
    // Upload background image to Cloudinary if provided
    if (backgroundImageFiles.length > 0 && backgroundImageFiles[0]) {
        const file = backgroundImageFiles[0];
        // Check if file has valid data (for Cloudinary storage, check path instead of buffer)
        if (file.path && file.path.trim() !== "") {
            console.log("Banner: File already uploaded to Cloudinary, using path:", file.path);
            bannerData.backgroundImage = file.path;
        }
        else {
            console.log("Banner: File has no valid path, trying manual upload...");
            try {
                const backgroundImageUrl = await (0, cloudinary_1.uploadImageToCloudinary)(file.buffer, "banners/backgrounds");
                bannerData.backgroundImage = backgroundImageUrl;
            }
            catch (error) {
                console.error("Banner: Image upload failed:", error);
                // Continue without image if upload fails
            }
        }
    }
    const result = await banner_service_1.BannerService.createBannerIntoDB(bannerData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Banner created successfully",
        data: result,
    });
});
const getAllBanners = (0, catchAsync_1.default)(async (req, res) => {
    const result = await banner_service_1.BannerService.getAllBannersFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Banners retrieved successfully",
        data: result.data,
        pagination: result.pagination,
    });
});
const getActiveBanners = (0, catchAsync_1.default)(async (req, res) => {
    const result = await banner_service_1.BannerService.getActiveBannersFromDB();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Active banners retrieved successfully",
        data: result,
    });
});
const getSingleBanner = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Banner ID is required",
        });
    }
    const result = await banner_service_1.BannerService.getSingleBannerFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Banner retrieved successfully",
        data: result,
    });
});
const updateBanner = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Banner ID is required",
        });
    }
    // Handle file uploads
    const files = req.files;
    const backgroundImageFiles = files || [];
    // Determine if this is FormData or JSON request
    const contentType = req.headers["content-type"];
    const isFormData = contentType && contentType.includes("multipart/form-data");
    // Prepare banner data based on request type
    let bannerData;
    if (isFormData) {
        // For FormData, data is directly in req.body
        bannerData = {
            title: req.body.title,
            description: req.body.description,
            isActive: req.body.isActive,
            backgroundImage: [],
        };
    }
    else {
        // For JSON, data is in req.body.body
        bannerData = req.body.body;
    }
    // Upload new background image to Cloudinary if provided
    if (backgroundImageFiles.length > 0 && backgroundImageFiles[0]) {
        const file = backgroundImageFiles[0];
        // Check if file has valid data (for Cloudinary storage, check path instead of buffer)
        if (file.path && file.path.trim() !== "") {
            console.log("Banner Update: File already uploaded to Cloudinary, using path:", file.path);
            bannerData.backgroundImage = file.path;
        }
        else {
            console.log("Banner Update: File has no valid path, trying manual upload...");
            try {
                const backgroundImageUrl = await (0, cloudinary_1.uploadImageToCloudinary)(file.buffer, "banners/backgrounds");
                bannerData.backgroundImage = backgroundImageUrl;
            }
            catch (error) {
                console.error("Banner Update: Image upload failed:", error);
                // Continue without updating image if upload fails
            }
        }
    }
    const result = await banner_service_1.BannerService.updateBannerIntoDB(id, bannerData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Banner updated successfully",
        data: result,
    });
});
const deleteBanner = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Banner ID is required",
        });
    }
    const result = await banner_service_1.BannerService.deleteBannerFromDB(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Banner deleted successfully",
        data: result,
    });
});
const toggleBannerStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const { isActive } = req.body;
    if (!id) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Banner ID is required",
        });
    }
    if (typeof isActive !== "boolean") {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "isActive must be a boolean value",
        });
    }
    const result = await banner_service_1.BannerService.toggleBannerStatusInDB(id, isActive);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: `Banner ${isActive ? "activated" : "deactivated"} successfully`,
        data: result,
    });
});
exports.BannerController = {
    createBanner,
    getAllBanners,
    getActiveBanners,
    getSingleBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
};
//# sourceMappingURL=banner.controller.js.map