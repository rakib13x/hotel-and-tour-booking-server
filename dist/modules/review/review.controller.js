"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_service_1 = require("./review.service");
const createReviewController = (0, catchAsync_1.default)(async (req, res) => {
    // Cast files with both fields
    const files = req.files;
    // Debug logging
    console.log("=== REVIEW CREATE DEBUG ===");
    console.log("Files received:", files);
    console.log("userProfileImg files:", files?.userProfileImg);
    console.log("userProfileImg length:", files?.userProfileImg?.length);
    if (files?.userProfileImg?.length) {
        console.log("First file buffer length:", files.userProfileImg[0]?.buffer?.length);
        console.log("First file fieldname:", files.userProfileImg[0]?.fieldname);
        console.log("First file originalname:", files.userProfileImg[0]?.originalname);
    }
    console.log("Body received:", req.body);
    console.log("=== END REVIEW CREATE DEBUG ===");
    // Extract body fields
    const { userName, designation, rating, comment } = req.body;
    // Prepare review object
    const reviewData = {
        userName,
        designation: designation || "Traveller",
        rating: Number(rating),
        comment,
    };
    // Upload tour images if provided
    // if (files?.tourImages?.length) {
    //   const uploaded = await uploadMultipleImages({
    //     files: files.tourImages,
    //     folder: "reviews/tours",
    //   });
    //   reviewData.tourImages = uploaded.map(img => img.secure_url);
    // }
    // Upload user profile image if exists
    console.log("=== IMAGE UPLOAD DEBUG ===");
    console.log("Files check:", !!files?.userProfileImg);
    console.log("Files length:", files?.userProfileImg?.length);
    if (files?.userProfileImg?.length && files.userProfileImg.length > 0) {
        console.log("Files found, checking buffer...");
        // Check if the file has valid data (for Cloudinary storage, check path instead of buffer)
        const validFiles = files.userProfileImg.filter((file) => {
            console.log(`File ${file.originalname}: buffer length = ${file.buffer?.length || 0}, path = ${file.path}`);
            // For Cloudinary storage, file.path contains the uploaded URL
            return file.path && file.path.trim() !== "";
        });
        console.log("Valid files count:", validFiles.length);
        if (validFiles.length > 0) {
            console.log("File already uploaded to Cloudinary, using path...");
            const profileImgUrl = validFiles[0]?.path;
            if (profileImgUrl) {
                reviewData.userProfileImg = profileImgUrl;
                console.log("Profile image URL set:", profileImgUrl);
            }
            else {
                console.log("No path found in uploaded file");
            }
        }
        else {
            console.log("No valid files found");
        }
    }
    else {
        console.log("No userProfileImg files received");
    }
    console.log("=== END IMAGE UPLOAD DEBUG ===");
    // Create review in DB via service
    const result = await review_service_1.ReviewService.createReviewService(reviewData);
    // Send response
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Review Created Successfully",
        data: result,
    });
});
const getAllReviewController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.getAllReviewServiceFromDB(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Reviews retrieved Successfully",
        pagination: result.pagination,
        data: result.data,
    });
});
const getSingleReviewController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.getSingleReviewServiceFromDB(req.params.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Review retrieved Successfully",
        data: result,
    });
});
const updateReviewController = (0, catchAsync_1.default)(async (req, res) => {
    const files = req.files;
    // Debug logging for update
    console.log("=== REVIEW UPDATE DEBUG ===");
    console.log("Files received:", files);
    console.log("userProfileImg files:", files?.userProfileImg);
    console.log("userProfileImg length:", files?.userProfileImg?.length);
    if (files?.userProfileImg?.length) {
        console.log("First file path:", files.userProfileImg[0]?.path);
        console.log("First file fieldname:", files.userProfileImg[0]?.fieldname);
        console.log("First file originalname:", files.userProfileImg[0]?.originalname);
    }
    console.log("Body received:", req.body);
    console.log("=== END REVIEW UPDATE DEBUG ===");
    const result = await review_service_1.ReviewService.updateReviewServiceFromDB(req.params.id, req.body, files);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Review updated Successfully",
        data: result,
    });
});
const deleteReviewController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.deleteReviewServiceFromDB(req.params.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Review deleted Successfully",
        data: result,
    });
});
const reorderReviewsController = (0, catchAsync_1.default)(async (req, res) => {
    const { reviewIds } = req.body;
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Review IDs array is required",
        });
    }
    const result = await review_service_1.ReviewService.reorderReviewsService(reviewIds);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Reviews reordered successfully",
        data: result,
    });
});
exports.ReviewController = {
    createReviewController,
    getAllReviewController,
    getSingleReviewController,
    updateReviewController,
    deleteReviewController,
    reorderReviewsController,
};
//# sourceMappingURL=review.controller.js.map