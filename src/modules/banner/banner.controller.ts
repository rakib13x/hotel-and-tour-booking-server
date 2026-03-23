import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BannerService } from "./banner.service";
import { uploadImageToCloudinary } from "../../services/cloudinary";

const createBanner = catchAsync(async (req: Request, res: Response) => {
  // Handle file uploads
  const files = req.files as Express.Multer.File[];
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
          .filter((url: string) => url.trim());
      } else if (Array.isArray(req.body.backgroundImage)) {
        backgroundImageArray = req.body.backgroundImage;
      }
    }

    bannerData = {
      title: req.body.title,
      description: req.body.description,
      isActive: req.body.isActive,
      backgroundImage: backgroundImageArray,
    };
  } else {
    // For JSON, data is in req.body.body
    bannerData = req.body.body;
  }

  // Upload background image to Cloudinary if provided
  if (backgroundImageFiles.length > 0 && backgroundImageFiles[0]) {
    const file = backgroundImageFiles[0];

    // Check if file has valid data (for Cloudinary storage, check path instead of buffer)
    if (file.path && file.path.trim() !== "") {
      console.log(
        "Banner: File already uploaded to Cloudinary, using path:",
        file.path,
      );
      bannerData.backgroundImage = file.path;
    } else {
      console.log("Banner: File has no valid path, trying manual upload...");
      try {
        const backgroundImageUrl = await uploadImageToCloudinary(
          file.buffer,
          "banners/backgrounds",
        );
        bannerData.backgroundImage = backgroundImageUrl;
      } catch (error) {
        console.error("Banner: Image upload failed:", error);
        // Continue without image if upload fails
      }
    }
  }

  const result = await BannerService.createBannerIntoDB(bannerData);
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Banner created successfully",
    data: result,
  });
});

export const BannerController = {
  createBanner,
};
