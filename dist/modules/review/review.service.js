"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_codes_1 = require("http-status-codes");
const review_model_1 = __importDefault(require("../../models/review.model"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const imageUtils_1 = require("../../utils/imageUtils");
// Work with an explicit model instance to satisfy TS
const ReviewModel = review_model_1.default;
/**
 * Helper function to ensure image URLs are full URLs
 */
const ensureFullImageUrl = (imagePath) => {
    // If it's already a full URL, return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    // If it's a public_id (starts with reviews/ or doesn't contain http), convert to full URL
    if (imagePath.startsWith("reviews/") || !imagePath.includes("http")) {
        return (0, imageUtils_1.getImageUrl)(imagePath);
    }
    // Return as is if it's already a relative path that should be converted
    return imagePath;
};
/**
 * Helper function to process review data and ensure all image URLs are full URLs
 */
const processReviewImages = (reviewData) => {
    if (reviewData.userProfileImg) {
        reviewData.userProfileImg = ensureFullImageUrl(reviewData.userProfileImg);
    }
    if (reviewData.tourImages && Array.isArray(reviewData.tourImages)) {
        reviewData.tourImages = reviewData.tourImages.map((img) => ensureFullImageUrl(img));
    }
    return reviewData;
};
const createReviewService = async (reviewData) => {
    // Process images to ensure full URLs
    const processedData = processReviewImages({ ...reviewData });
    const review = await ReviewModel.create(processedData);
    if (!review) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create review");
    }
    return review;
};
const getAllReviewServiceFromDB = async (query) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "order";
    // Default to ascending (1) for order field, descending (-1) for others
    const sortOrder = query.sortOrder
        ? query.sortOrder === "asc"
            ? 1
            : -1
        : sortBy === "order"
            ? 1
            : -1;
    const search = query.search || "";
    const filter = {};
    if (search) {
        filter.$or = [
            { userName: { $regex: search, $options: "i" } },
            { designation: { $regex: search, $options: "i" } },
            { comment: { $regex: search, $options: "i" } },
        ];
    }
    const [data, total] = await Promise.all([
        ReviewModel.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit),
        ReviewModel.countDocuments(filter),
    ]);
    // Process images to ensure full URLs
    const processedData = data.map((review) => processReviewImages(review));
    const pages = Math.ceil(total / limit) || 1;
    return {
        pagination: { page, limit, total, pages },
        data: processedData,
    };
};
const getSingleReviewServiceFromDB = async (id) => {
    const review = await ReviewModel.findById(id);
    if (!review) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to get review");
    }
    // Process images to ensure full URLs
    return processReviewImages(review);
};
const updateReviewServiceFromDB = async (id, reviewData, files) => {
    const updateData = { ...reviewData };
    // Handle tour images upload if provided
    // if (files?.tourImages?.length) {
    //   const uploadedTourImages = await uploadMultipleImages({
    //     files: files.tourImages,
    //     folder: "reviews/tours",
    //   });
    //   updateData.tourImages = uploadedTourImages.map((img) => img.secure_url);
    // }
    // Handle user profile image upload if provided
    if (files?.userProfileImg?.length && files.userProfileImg.length > 0) {
        // Check if the file has valid data (for Cloudinary storage, check path instead of buffer)
        const validFiles = files.userProfileImg.filter((file) => file.path && file.path.trim() !== "");
        if (validFiles.length > 0) {
            // File already uploaded to Cloudinary, use the path directly
            updateData.userProfileImg = validFiles[0]?.path;
        }
    }
    // Process images to ensure full URLs
    const processedData = processReviewImages(updateData);
    const review = await ReviewModel.findByIdAndUpdate(id, processedData, {
        new: true,
    });
    if (!review) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update review");
    }
    return review;
};
const deleteReviewServiceFromDB = async (id) => {
    const review = await ReviewModel.findByIdAndDelete(id);
    if (!review) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to delete review");
    }
    // Process images to ensure full URLs
    return processReviewImages(review);
};
const reorderReviewsService = async (reviewIds) => {
    try {
        console.log("=== REORDER REVIEWS SERVICE ===");
        console.log("Review IDs received:", reviewIds);
        console.log("Review IDs count:", reviewIds.length);
        const updatePromises = reviewIds.map((id, index) => {
            console.log(`Setting review ${id} to order ${index + 1}`);
            return ReviewModel.findByIdAndUpdate(id, { order: index + 1 }, { new: true });
        });
        await Promise.all(updatePromises);
        console.log("All updates completed");
        // Return updated reviews in new order
        const updatedReviews = await ReviewModel.find({
            _id: { $in: reviewIds },
        }).sort({ order: 1 });
        console.log("Updated reviews count:", updatedReviews.length);
        console.log("Updated reviews order:", updatedReviews.map((r) => ({ id: r._id, order: r.order })));
        console.log("=== END REORDER REVIEWS SERVICE ===");
        return updatedReviews.map((review) => processReviewImages(review));
    }
    catch (error) {
        console.error("Reorder error:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to reorder reviews");
    }
};
exports.ReviewService = {
    createReviewService,
    getAllReviewServiceFromDB,
    getSingleReviewServiceFromDB,
    updateReviewServiceFromDB,
    deleteReviewServiceFromDB,
    reorderReviewsService,
};
//# sourceMappingURL=review.service.js.map