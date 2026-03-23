import { StatusCodes } from "http-status-codes";
import Review from "../../models/review.model";
import ApiError from "../../utils/ApiError";
import { getImageUrl } from "../../utils/imageUtils";
import { IReview } from "./review.interface";

// Work with an explicit model instance to satisfy TS
const ReviewModel = Review as import("mongoose").Model<any>;

/**
 * Helper function to ensure image URLs are full URLs
 */
const ensureFullImageUrl = (imagePath: string): string => {
  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // If it's a public_id (starts with reviews/ or doesn't contain http), convert to full URL
  if (imagePath.startsWith("reviews/") || !imagePath.includes("http")) {
    return getImageUrl(imagePath);
  }
  // Return as is if it's already a relative path that should be converted
  return imagePath;
};

/**
 * Helper function to process review data and ensure all image URLs are full URLs
 */
const processReviewImages = (reviewData: any): any => {
  if (reviewData.userProfileImg) {
    reviewData.userProfileImg = ensureFullImageUrl(reviewData.userProfileImg);
  }
  if (reviewData.tourImages && Array.isArray(reviewData.tourImages)) {
    reviewData.tourImages = reviewData.tourImages.map((img: string) =>
      ensureFullImageUrl(img)
    );
  }
  return reviewData;
};

const createReviewService = async (reviewData: IReview) => {
  // Process images to ensure full URLs
  const processedData = processReviewImages({ ...reviewData });

  const review = await ReviewModel.create(processedData);

  if (!review) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create review");
  }

  return review;
};

const getAllReviewServiceFromDB = async (query: Record<string, any>) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  const sortBy = (query.sortBy as string) || "order";
  // Default to ascending (1) for order field, descending (-1) for others
  const sortOrder = query.sortOrder
    ? query.sortOrder === "asc"
      ? 1
      : -1
    : sortBy === "order"
    ? 1
    : -1;
  const search = (query.search as string) || "";

  const filter: any = {};
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
  const processedData = data.map((review: any) => processReviewImages(review));

  const pages = Math.ceil(total / limit) || 1;

  return {
    pagination: { page, limit, total, pages },
    data: processedData,
  };
};

const getSingleReviewServiceFromDB = async (id: string) => {
  const review = await ReviewModel.findById(id);
  if (!review) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get review");
  }

  // Process images to ensure full URLs
  return processReviewImages(review);
};

const updateReviewServiceFromDB = async (
  id: string,
  reviewData: IReview,
  files: any
) => {
  const updateData: any = { ...reviewData };

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
    const validFiles = files.userProfileImg.filter(
      (file: Express.Multer.File) => file.path && file.path.trim() !== ""
    );

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
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update review");
  }

  return review;
};

const deleteReviewServiceFromDB = async (id: string) => {
  const review = await ReviewModel.findByIdAndDelete(id);
  if (!review) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete review");
  }

  // Process images to ensure full URLs
  return processReviewImages(review);
};

const reorderReviewsService = async (reviewIds: string[]) => {
  try {
    console.log("=== REORDER REVIEWS SERVICE ===");
    console.log("Review IDs received:", reviewIds);
    console.log("Review IDs count:", reviewIds.length);

    const updatePromises = reviewIds.map((id, index) => {
      console.log(`Setting review ${id} to order ${index + 1}`);
      return ReviewModel.findByIdAndUpdate(
        id,
        { order: index + 1 },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    console.log("All updates completed");

    // Return updated reviews in new order
    const updatedReviews = await ReviewModel.find({
      _id: { $in: reviewIds },
    }).sort({ order: 1 });

    console.log("Updated reviews count:", updatedReviews.length);
    console.log(
      "Updated reviews order:",
      updatedReviews.map((r: any) => ({ id: r._id, order: r.order }))
    );
    console.log("=== END REORDER REVIEWS SERVICE ===");

    return updatedReviews.map((review: any) => processReviewImages(review));
  } catch (error) {
    console.error("Reorder error:", error);
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to reorder reviews");
  }
};

export const ReviewService = {
  createReviewService,
  getAllReviewServiceFromDB,
  getSingleReviewServiceFromDB,
  updateReviewServiceFromDB,
  deleteReviewServiceFromDB,
  reorderReviewsService,
};
