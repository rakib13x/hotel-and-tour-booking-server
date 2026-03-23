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

const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await BannerService.getAllBannersFromDB(req.query);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Banners retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getActiveBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await BannerService.getActiveBannersFromDB();
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Active banners retrieved successfully",
    data: result,
  });
});

const getSingleBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Banner ID is required",
    });
  }
  const result = await BannerService.getSingleBannerFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Banner retrieved successfully",
    data: result,
  });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Banner ID is required",
    });
  }

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
    bannerData = {
      title: req.body.title,
      description: req.body.description,
      isActive: req.body.isActive,
      backgroundImage: [],
    };
  } else {
    // For JSON, data is in req.body.body
    bannerData = req.body.body;
  }

  // Upload new background image to Cloudinary if provided
  if (backgroundImageFiles.length > 0 && backgroundImageFiles[0]) {
    const file = backgroundImageFiles[0];

    // Check if file has valid data (for Cloudinary storage, check path instead of buffer)
    if (file.path && file.path.trim() !== "") {
      console.log(
        "Banner Update: File already uploaded to Cloudinary, using path:",
        file.path,
      );
      bannerData.backgroundImage = file.path;
    } else {
      console.log(
        "Banner Update: File has no valid path, trying manual upload...",
      );
      try {
        const backgroundImageUrl = await uploadImageToCloudinary(
          file.buffer,
          "banners/backgrounds",
        );
        bannerData.backgroundImage = backgroundImageUrl;
      } catch (error) {
        console.error("Banner Update: Image upload failed:", error);
        // Continue without updating image if upload fails
      }
    }
  }

  const result = await BannerService.updateBannerIntoDB(id, bannerData);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Banner updated successfully",
    data: result,
  });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Banner ID is required",
    });
  }

  const result = await BannerService.deleteBannerFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Banner deleted successfully",
    data: result,
  });
});

const toggleBannerStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { isActive } = req.body;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Banner ID is required",
    });
  }

  if (typeof isActive !== "boolean") {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "isActive must be a boolean value",
    });
  }

  const result = await BannerService.toggleBannerStatusInDB(id, isActive);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: `Banner ${isActive ? "activated" : "deactivated"} successfully`,
    data: result,
  });
});

export const BannerController = {
  createBanner,
  getAllBanners,
  getActiveBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
};
