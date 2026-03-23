import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IReview } from "./review.interface";
import { ReviewService } from "./review.service";

const createReviewController = catchAsync(
  async (req: Request, res: Response) => {
    // Cast files with both fields
    const files = req.files as {
      // tourImages?: Express.Multer.File[];
      userProfileImg?: Express.Multer.File[];
    };

    // Debug logging
    console.log("=== REVIEW CREATE DEBUG ===");
    console.log("Files received:", files);
    console.log("userProfileImg files:", files?.userProfileImg);
    console.log("userProfileImg length:", files?.userProfileImg?.length);
    if (files?.userProfileImg?.length) {
      console.log(
        "First file buffer length:",
        files.userProfileImg[0]?.buffer?.length
      );
      console.log("First file fieldname:", files.userProfileImg[0]?.fieldname);
      console.log(
        "First file originalname:",
        files.userProfileImg[0]?.originalname
      );
    }
    console.log("Body received:", req.body);
    console.log("=== END REVIEW CREATE DEBUG ===");

    // Extract body fields
    const { userName, designation, rating, comment } = req.body;

    // Prepare review object
    const reviewData: IReview = {
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
      const validFiles = files.userProfileImg.filter(
        (file: Express.Multer.File) => {
          console.log(
            `File ${file.originalname}: buffer length = ${
              file.buffer?.length || 0
            }, path = ${file.path}`
          );
          // For Cloudinary storage, file.path contains the uploaded URL
          return file.path && file.path.trim() !== "";
        }
      );

      console.log("Valid files count:", validFiles.length);

      if (validFiles.length > 0) {
        console.log("File already uploaded to Cloudinary, using path...");
        const profileImgUrl = validFiles[0]?.path;
        if (profileImgUrl) {
          reviewData.userProfileImg = profileImgUrl;
          console.log("Profile image URL set:", profileImgUrl);
        } else {
          console.log("No path found in uploaded file");
        }
      } else {
        console.log("No valid files found");
      }
    } else {
      console.log("No userProfileImg files received");
    }
    console.log("=== END IMAGE UPLOAD DEBUG ===");

    // Create review in DB via service
    const result = await ReviewService.createReviewService(reviewData);

    // Send response
    sendResponse(res, StatusCodes.CREATED, {
      success: true,
      message: "Review Created Successfully",
      data: result,
    });
  }
);

const getAllReviewController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReviewService.getAllReviewServiceFromDB(req.query);
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Reviews retrieved Successfully",
      pagination: result.pagination,
      data: result.data,
    });
  }
);

const getSingleReviewController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReviewService.getSingleReviewServiceFromDB(
      req.params.id as string
    );
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Review retrieved Successfully",
      data: result,
    });
  }
);

const updateReviewController = catchAsync(
  async (req: Request, res: Response) => {
    const files = req.files as {
      // tourImages?: Express.Multer.File[];
      userProfileImg?: Express.Multer.File[];
    };

    // Debug logging for update
    console.log("=== REVIEW UPDATE DEBUG ===");
    console.log("Files received:", files);
    console.log("userProfileImg files:", files?.userProfileImg);
    console.log("userProfileImg length:", files?.userProfileImg?.length);
    if (files?.userProfileImg?.length) {
      console.log("First file path:", files.userProfileImg[0]?.path);
      console.log("First file fieldname:", files.userProfileImg[0]?.fieldname);
      console.log(
        "First file originalname:",
        files.userProfileImg[0]?.originalname
      );
    }
    console.log("Body received:", req.body);
    console.log("=== END REVIEW UPDATE DEBUG ===");

    const result = await ReviewService.updateReviewServiceFromDB(
      req.params.id as string,
      req.body,
      files
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Review updated Successfully",
      data: result,
    });
  }
);

const deleteReviewController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReviewService.deleteReviewServiceFromDB(
      req.params.id as string
    );
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Review deleted Successfully",
      data: result,
    });
  }
);

const reorderReviewsController = catchAsync(
  async (req: Request, res: Response) => {
    const { reviewIds } = req.body;

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Review IDs array is required",
      });
    }

    const result = await ReviewService.reorderReviewsService(reviewIds);
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Reviews reordered successfully",
      data: result,
    });
  }
);

export const ReviewController = {
  createReviewController,
  getAllReviewController,
  getSingleReviewController,
  updateReviewController,
  deleteReviewController,
  reorderReviewsController,
};
