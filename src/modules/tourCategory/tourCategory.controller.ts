import { Request, Response } from "express";
import cloudinaryService from "../../services/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import TourCategoryService from "./tourCategory.service";

class TourCategoryController {
  // Create tour category without image
  createTourCategory = catchAsync(async (req: Request, res: Response) => {
    const tourCategory = await TourCategoryService.createTourCategory(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Tour category created successfully",
      data: tourCategory,
    });
  });

  // Create tour category with image
  createTourCategoryWithImage = catchAsync(
    async (req: Request, res: Response) => {
      // Debug logging
      console.log("=== CREATE TOUR CATEGORY WITH IMAGE ===");
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);
      console.log("category_name:", req.body.category_name);
      console.log("description:", req.body.description);

      // Handle file upload - Manual Cloudinary upload with memory storage
      let imageUrl: string | undefined;
      if (req.file && req.file.buffer) {
        console.log("Uploading image to Cloudinary...");
        const uploadResult = await cloudinaryService.uploadImage(req.file, {
          folder: "tour-categories",
          quality: "auto",
        });
        imageUrl = uploadResult.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      }

      const tourCategoryData: any = {
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

      const tourCategory = await TourCategoryService.createTourCategory(
        tourCategoryData
      );

      sendResponse(res, 201, {
        success: true,
        message: "Tour category created successfully with image",
        data: tourCategory,
      });
    }
  );

  // Get all tour categories
  getTourCategories = catchAsync(async (req: Request, res: Response) => {
    const options = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
    };

    const result = await TourCategoryService.getTourCategories(options);

    sendResponse(res, 200, {
      success: true,
      message: "Tour categories retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  });

  // Get all active tour categories (for dropdown)
  getAllActiveTourCategories = catchAsync(
    async (req: Request, res: Response) => {
      const tourCategories =
        await TourCategoryService.getAllActiveTourCategories();

      sendResponse(res, 200, {
        success: true,
        message: "Active tour categories retrieved successfully",
        data: tourCategories,
      });
    }
  );

  // Get single tour category
  getTourCategoryById = catchAsync(async (req: Request, res: Response) => {
    const tourCategory = await TourCategoryService.getTourCategoryById(
      req.params.id as string
    );

    sendResponse(res, 200, {
      success: true,
      message: "Tour category retrieved successfully",
      data: tourCategory,
    });
  });

  // Update tour category without image
  updateTourCategory = catchAsync(async (req: Request, res: Response) => {
    const tourCategory = await TourCategoryService.updateTourCategory(
      req.params.id as string,
      req.body
    );

    sendResponse(res, 200, {
      success: true,
      message: "Tour category updated successfully",
      data: tourCategory,
    });
  });

  // Update tour category with image
  updateTourCategoryWithImage = catchAsync(
    async (req: Request, res: Response) => {
      // Debug logging
      console.log("=== UPDATE TOUR CATEGORY WITH IMAGE ===");
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);
      console.log("category_name:", req.body.category_name);
      console.log("description:", req.body.description);

      // Handle file upload - Manual Cloudinary upload with memory storage
      let imageUrl: string | undefined;
      if (req.file && req.file.buffer) {
        console.log("Uploading image to Cloudinary...");
        const uploadResult = await cloudinaryService.uploadImage(req.file, {
          folder: "tour-categories",
          quality: "auto",
        });
        imageUrl = uploadResult.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      }

      const updateData: any = {};
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

      const tourCategory = await TourCategoryService.updateTourCategory(
        req.params.id as string,
        updateData
      );

      sendResponse(res, 200, {
        success: true,
        message: "Tour category updated successfully with image",
        data: tourCategory,
      });
    }
  );

  // Delete tour category
  deleteTourCategory = catchAsync(async (req: Request, res: Response) => {
    await TourCategoryService.deleteTourCategory(req.params.id as string);

    sendResponse(res, 200, {
      success: true,
      message: "Tour category deleted successfully",
      data: null,
    });
  });
}

export default new TourCategoryController();
